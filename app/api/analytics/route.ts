import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, appointments, clients, expenses, staff } from '@/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const range = searchParams.get('range') || '30d';

    let startDate: Date | null = null;
    if (range === '7d') startDate = new Date(Date.now() - 7 * 86400000);
    else if (range === '30d') startDate = new Date(Date.now() - 30 * 86400000);
    else if (range === '90d') startDate = new Date(Date.now() - 90 * 86400000);

    const invConds = [];
    if (workspaceId) invConds.push(eq(invoices.workspaceId, workspaceId));
    if (startDate) invConds.push(gte(invoices.createdAt, startDate));

    // Aggregate total revenue from invoices
    const [revResult] = await db
      .select({
        totalRevenueCents: sql<number>`COALESCE(SUM(${invoices.totalCents}), 0)`,
        paidInvoicesCount: sql<number>`COUNT(${invoices.id})`,
      })
      .from(invoices)
      .where(invConds.length > 0 ? and(...invConds) : undefined);

    const aptConds = [];
    if (workspaceId) aptConds.push(eq(appointments.workspaceId, workspaceId));
    if (startDate) aptConds.push(gte(appointments.createdAt, startDate));

    // Count total appointments
    const [aptResult] = await db
      .select({
        totalAppointments: sql<number>`COUNT(${appointments.id})`,
      })
      .from(appointments)
      .where(aptConds.length > 0 ? and(...aptConds) : undefined);

    // Count total clients
    const [cliResult] = await db
      .select({
        totalClients: sql<number>`COUNT(${clients.id})`,
      })
      .from(clients)
      .where(workspaceId ? eq(clients.workspaceId, workspaceId) : undefined);

    const expConds = [];
    if (workspaceId) expConds.push(eq(expenses.workspaceId, workspaceId));
    if (startDate) expConds.push(gte(expenses.createdAt, startDate));

    // Aggregate expenses
    const [expResult] = await db
      .select({
        totalExpensesCents: sql<number>`COALESCE(SUM(${expenses.amountCents}), 0)`,
      })
      .from(expenses)
      .where(expConds.length > 0 ? and(...expConds) : undefined);

    // Daily revenue trend
    const invoiceRows = await db
      .select({
        totalCents: invoices.totalCents,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .where(invConds.length > 0 ? and(...invConds) : undefined);

    const dailyMap = new Map<string, { revenue: number; count: number }>();
    for (const row of invoiceRows) {
      const dateKey = new Date(row.createdAt).toISOString().slice(0, 10);
      const prev = dailyMap.get(dateKey) || { revenue: 0, count: 0 };
      dailyMap.set(dateKey, {
        revenue: prev.revenue + (row.totalCents || 0) / 100,
        count: prev.count + 1,
      });
    }
    const dailyRevenue = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, val]) => ({ date, revenue: Math.round(val.revenue * 100) / 100, count: val.count }));

    // Staff commission & payroll breakdown (completed or paid appointments in range)
    const staffAptRows = await db
      .select({
        staffId: staff.id,
        staffName: staff.name,
        role: staff.role,
        commissionPercent: staff.commissionPercent,
        priceCents: appointments.priceCents,
        status: appointments.status,
        paymentStatus: appointments.paymentStatus,
      })
      .from(appointments)
      .innerJoin(staff, eq(appointments.staffId, staff.id))
      .where(aptConds.length > 0 ? and(...aptConds) : undefined);

    const payrollMap = new Map<
      string,
      { staffId: string; staffName: string; role: string; appointmentsCount: number; grossRevenue: number; commissionPercent: number }
    >();

    for (const row of staffAptRows) {
      if (row.status !== 'completed' && row.paymentStatus !== 'paid') continue;
      const existing = payrollMap.get(row.staffId) || {
        staffId: row.staffId,
        staffName: row.staffName,
        role: row.role,
        appointmentsCount: 0,
        grossRevenue: 0,
        commissionPercent: row.commissionPercent ?? 70,
      };
      existing.appointmentsCount += 1;
      existing.grossRevenue += (row.priceCents || 0) / 100;
      payrollMap.set(row.staffId, existing);
    }

    const staffPayroll = Array.from(payrollMap.values())
      .map((item) => ({
        ...item,
        grossRevenue: Math.round(item.grossRevenue * 100) / 100,
        payoutOwed: Math.round(item.grossRevenue * (item.commissionPercent / 100) * 100) / 100,
      }))
      .sort((a, b) => b.grossRevenue - a.grossRevenue);

    const totalRevenue = (revResult?.totalRevenueCents || 0) / 100;
    const totalExpenses = (expResult?.totalExpensesCents || 0) / 100;
    const netProfit = totalRevenue - totalExpenses;

    return NextResponse.json({
      success: true,
      analytics: {
        totalRevenue,
        paidInvoicesCount: Number(revResult?.paidInvoicesCount || 0),
        totalAppointments: Number(aptResult?.totalAppointments || 0),
        totalClients: Number(cliResult?.totalClients || 0),
        totalExpenses,
        netProfit,
        dailyRevenue,
        staffPayroll,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch analytics.' }, { status: 500 });
  }
}
