import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { promotions, workspaces } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET /api/promotions - List promo codes
export async function GET(req: NextRequest) {
  try {
    const [ws] = await db.select().from(workspaces).limit(1);
    if (!ws) return NextResponse.json({ promotions: [] });

    const promoList = await db
      .select()
      .from(promotions)
      .where(eq(promotions.workspaceId, ws.id));

    return NextResponse.json({ promotions: promoList });
  } catch (error: any) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/promotions - Create a new promo code
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [ws] = await db.select().from(workspaces).limit(1);
    if (!ws) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const body = await req.json();

    const [newPromo] = await db
      .insert(promotions)
      .values({
        workspaceId: ws.id,
        code: (body.code || `PROMO${Math.floor(Math.random() * 1000)}`).toUpperCase(),
        discountPercent: body.discountPercent || 15,
        maxUses: body.maxUses || 100,
        currentUses: 0,
      })
      .returning();

    return NextResponse.json({ promotion: newPromo }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
