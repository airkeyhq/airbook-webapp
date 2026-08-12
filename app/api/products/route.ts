import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    const productList = await db
      .select()
      .from(products)
      .where(workspaceId ? eq(products.workspaceId, workspaceId) : undefined)
      .orderBy(desc(products.createdAt));

    return NextResponse.json({ success: true, products: productList });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, name, sku, category, retailPriceCents, costPriceCents, stockQuantity, lowStockAlertThreshold, isRetail } = body;

    if (!name || retailPriceCents === undefined) {
      return NextResponse.json({ error: 'Product name and price are required.' }, { status: 400 });
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        workspaceId: workspaceId || '00000000-0000-0000-0000-000000000001',
        name,
        sku: sku || null,
        category: category || 'General',
        retailPriceCents: Number(retailPriceCents),
        costPriceCents: costPriceCents ? Number(costPriceCents) : 0,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 10,
        lowStockAlertThreshold: lowStockAlertThreshold !== undefined ? Number(lowStockAlertThreshold) : 5,
        isRetail: isRetail !== undefined ? Boolean(isRetail) : true,
      })
      .returning();

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create product.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, stockQuantity, retailPriceCents } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (stockQuantity !== undefined) updateFields.stockQuantity = Number(stockQuantity);
    if (retailPriceCents !== undefined) updateFields.retailPriceCents = Number(retailPriceCents);

    const [updated] = await db
      .update(products)
      .set(updateFields)
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete product.' }, { status: 500 });
  }
}
