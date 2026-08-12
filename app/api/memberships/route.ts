import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { memberships, workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/memberships - List membership tiers
export async function GET(req: NextRequest) {
  try {
    const [ws] = await db.select().from(workspaces).limit(1);
    if (!ws) return NextResponse.json({ success: true, memberships: [] });

    const list = await db
      .select()
      .from(memberships)
      .where(eq(memberships.workspaceId, ws.id));

    return NextResponse.json({ success: true, memberships: list });
  } catch (error: any) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/memberships - Create a new membership tier
export async function POST(req: NextRequest) {
  try {
    let [ws] = await db.select().from(workspaces).limit(1);
    const body = await req.json();

    const [newMem] = await db
      .insert(memberships)
      .values({
        workspaceId: ws?.id || '00000000-0000-0000-0000-000000000001',
        name: body.name || 'VIP Glow Monthly Pass',
        monthlyPriceCents: Math.round((body.monthlyPrice || 140) * 100),
        includedServicesCount: body.includedServicesCount || 2,
        discountPercentRetail: body.discountPercentRetail || 15,
      })
      .returning();

    return NextResponse.json({ success: true, membership: newMem }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating membership:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
