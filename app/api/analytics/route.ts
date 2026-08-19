import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, appointments, clients, expenses } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    // Aggregate total revenue from invoices
    const [revResult] = await db
      .select({
        totalRevenueCents: sql<number>`COALESCE(SUM(${invoices.totalCents}), 0)`,
        paidInvoicesCount: sql<number>`COUNT(${invoices.id})`,
      })
      .from(invoices)
      .where(workspaceId ? eq(invoices.workspaceId, workspaceId) : undefined);

    // Count total appointments
    const [aptResult] = await db
      .select({
        totalAppointments: sql<number>`COUNT(${appointments.id})`,
      })
      .from(appointments)
      .where(workspaceId ? eq(appointments.workspaceId, workspaceId) : undefined);

    // Count total clients
    const [cliResult] = await db
      .select({
        totalClients: sql<number>`COUNT(${clients.id})`,
      })
      .from(clients)
      .where(workspaceId ? eq(clients.workspaceId, workspaceId) : undefined);

    // Aggregate expenses
    const [expResult] = await db
      .select({
        totalExpensesCents: sql<number>`COALESCE(SUM(${expenses.amountCents}), 0)`,
      })
      .from(expenses)
      .where(workspaceId ? eq(expenses.workspaceId, workspaceId) : undefined);

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
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch analytics.' }, { status: 500 });
  }
}
