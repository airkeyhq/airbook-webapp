import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, appointments, products, clients } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/checkout - Fetch recent completed invoices for the workspace
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    const recentInvoices = await db
      .select({
        id: invoices.id,
        clientId: invoices.clientId,
        clientName: clients.name,
        clientEmail: clients.email,
        appointmentId: invoices.appointmentId,
        subtotalCents: invoices.subtotalCents,
        tipCents: invoices.tipCents,
        taxCents: invoices.taxCents,
        discountCents: invoices.discountCents,
        totalCents: invoices.totalCents,
        paymentMethod: invoices.paymentMethod,
        receiptNumber: invoices.receiptNumber,
        status: invoices.status,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(invoices.workspaceId, workspaceId))
      .orderBy(desc(invoices.createdAt))
      .limit(30);

    return NextResponse.json({ success: true, invoices: recentInvoices });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch invoices.' }, { status: 500 });
  }
}

// POST /api/checkout - Atomic POS transaction processing
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      workspaceId: providedWorkspaceId,
      clientId: providedClientId,
      clientName: providedClientName,
      appointmentId,
      items, // array of { name: string, priceCents: number, quantity?: number, productId?: string }
      subtotalCents,
      tipCents = 0,
      taxCents = 0,
      discountCents = 0,
      totalCents,
      paymentMethod = 'card', // 'card' | 'cash' | 'split' | 'gift_card'
    } = body;

    const workspaceId = await getActiveWorkspaceId(providedWorkspaceId);
    const calculatedTotal = Number(totalCents) || (Number(subtotalCents || 0) + Number(tipCents || 0) + Number(taxCents || 0) - Number(discountCents || 0));

    if (!calculatedTotal || calculatedTotal <= 0) {
      return NextResponse.json({ error: 'Valid checkout total amount required.' }, { status: 400 });
    }

    const receiptNumber = `REC-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const result = await db.transaction(async (tx) => {
      // 1. Resolve or Create Client
      let targetClientId = providedClientId;
      if (!targetClientId || targetClientId === 'walkin' || targetClientId === 'new') {
        const [walkinClient] = await tx
          .insert(clients)
          .values({
            workspaceId,
            name: providedClientName?.trim() || 'Walk-in Client',
            totalVisits: 1,
            totalSpentCents: calculatedTotal,
          })
          .returning();
        targetClientId = walkinClient.id;
      } else {
        // Increment client visits & lifetime spend
        await tx
          .update(clients)
          .set({
            totalVisits: sql`${clients.totalVisits} + 1`,
            totalSpentCents: sql`${clients.totalSpentCents} + ${calculatedTotal}`,
          })
          .where(eq(clients.id, targetClientId));
      }

      // 2. Create Invoice record
      const [newInvoice] = await tx
        .insert(invoices)
        .values({
          workspaceId,
          clientId: targetClientId,
          appointmentId: appointmentId || null,
          subtotalCents: Number(subtotalCents || calculatedTotal - tipCents - taxCents + discountCents),
          tipCents: Number(tipCents),
          taxCents: Number(taxCents),
          discountCents: Number(discountCents),
          totalCents: calculatedTotal,
          paymentMethod,
          receiptNumber,
          status: 'paid',
        })
        .returning();

      // 3. If appointment provided, mark as completed & paid
      if (appointmentId) {
        await tx
          .update(appointments)
          .set({
            status: 'completed',
            paymentStatus: 'paid',
          })
          .where(eq(appointments.id, appointmentId));
      }

      // 4. If retail products bought in line items, deduct stock
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item.productId) {
            await tx
              .update(products)
              .set({
                stockQuantity: sql`GREATEST(0, ${products.stockQuantity} - ${item.quantity || 1})`,
              })
              .where(eq(products.id, item.productId));
          }
        }
      }

      return newInvoice;
    });

    return NextResponse.json({
      success: true,
      invoice: result,
      receiptNumber,
      message: 'Transaction completed successfully.',
    });
  } catch (err: any) {
    console.error('POS Checkout Error:', err);
    return NextResponse.json({ error: err?.message || 'Checkout failed.' }, { status: 500 });
  }
}
