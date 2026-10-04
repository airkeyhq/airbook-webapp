import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    let productList = await db
      .select()
      .from(products)
      .where(eq(products.workspaceId, workspaceId))
      .orderBy(desc(products.createdAt));

    return NextResponse.json({ success: true, products: productList });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      name,
      sku,
      category,
      retailPriceCents,
      costPriceCents,
      stockQuantity,
      lowStockAlertThreshold,
      isRetail,
      imageUrl,
    } = body;

    if (!name || retailPriceCents === undefined) {
      return NextResponse.json({ error: 'Product name and retail price are required.' }, { status: 400 });
    }

    const activeWorkspaceId = await getActiveWorkspaceId(workspaceId);

    const [newProduct] = await db
      .insert(products)
      .values({
        workspaceId: activeWorkspaceId,
        name: name.trim(),
        sku: sku?.trim() || null,
        category: category?.trim() || 'General',
        retailPriceCents: Math.round(Number(retailPriceCents)),
        costPriceCents: costPriceCents !== undefined ? Math.round(Number(costPriceCents)) : 0,
        stockQuantity: stockQuantity !== undefined ? Math.max(0, Number(stockQuantity)) : 10,
        lowStockAlertThreshold: lowStockAlertThreshold !== undefined ? Number(lowStockAlertThreshold) : 5,
        isRetail: isRetail !== undefined ? Boolean(isRetail) : true,
        imageUrl: imageUrl?.trim() || null,
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
    const {
      id,
      name,
      sku,
      category,
      retailPriceCents,
      costPriceCents,
      stockQuantity,
      deltaQuantity,
      lowStockAlertThreshold,
      isRetail,
      imageUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (sku !== undefined) updateFields.sku = sku ? sku.trim() : null;
    if (category !== undefined) updateFields.category = category.trim();
    if (retailPriceCents !== undefined) updateFields.retailPriceCents = Math.round(Number(retailPriceCents));
    if (costPriceCents !== undefined) updateFields.costPriceCents = Math.round(Number(costPriceCents));
    if (stockQuantity !== undefined) updateFields.stockQuantity = Math.max(0, Number(stockQuantity));
    if (lowStockAlertThreshold !== undefined) updateFields.lowStockAlertThreshold = Number(lowStockAlertThreshold);
    if (isRetail !== undefined) updateFields.isRetail = Boolean(isRetail);
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl ? imageUrl.trim() : null;

    let updated;
    if (deltaQuantity !== undefined && Number(deltaQuantity) !== 0) {
      // Atomic delta adjustment
      [updated] = await db
        .update(products)
        .set({
          ...updateFields,
          stockQuantity: sql`GREATEST(0, ${products.stockQuantity} + ${Number(deltaQuantity)})`,
        })
        .where(eq(products.id, id))
        .returning();
    } else {
      [updated] = await db
        .update(products)
        .set(updateFields)
        .where(eq(products.id, id))
        .returning();
    }

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
