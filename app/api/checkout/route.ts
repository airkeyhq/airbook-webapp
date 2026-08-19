import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, appointments, products } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      clientId,
      appointmentId,
      items, // array of { productId?: string, priceCents: number, quantity: number }
      totalCents,
      paymentMethod, // 'card' | 'cash' | 'stripe'
    } = body;

    if (!workspaceId || !clientId || !totalCents) {
      return NextResponse.json({ error: 'Workspace ID, client ID, and total amount are required.' }, { status: 400 });
    }

    const result = await db.transaction(async (tx) => {
      // 1. Create Invoice record
      const [newInvoice] = await tx
        .insert(invoices)
        .values({
          workspaceId,
          clientId,
          appointmentId: appointmentId || null,
          totalCents: Number(totalCents),
          status: 'paid',
        })
        .returning();

      // 2. If appointment provided, mark as completed & paid
      if (appointmentId) {
        await tx
          .update(appointments)
          .set({
            status: 'completed',
            paymentStatus: 'paid',
          })
          .where(eq(appointments.id, appointmentId));
      }

      // 3. If products bought in line items, deduct stock
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item.productId) {
            await tx
              .update(products)
              .set({
                stockQuantity: sql`${products.stockQuantity} - ${item.quantity || 1}`,
              })
              .where(eq(products.id, item.productId));
          }
        }
      }

      return newInvoice;
    });

    return NextResponse.json({ success: true, invoice: result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Checkout failed.' }, { status: 500 });
  }
}
