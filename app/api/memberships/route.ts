import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { memberships, workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET /api/memberships - List membership tiers
export async function GET(req: NextRequest) {
  try {
    const [ws] = await db.select().from(workspaces).limit(1);
    if (!ws) return NextResponse.json({ memberships: [] });

    const list = await db
      .select()
      .from(memberships)
      .where(eq(memberships.workspaceId, ws.id));

    return NextResponse.json({ memberships: list });
  } catch (error: any) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/memberships - Create a new membership tier
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

    const [newMem] = await db
      .insert(memberships)
      .values({
        workspaceId: ws.id,
        name: body.name || 'VIP Glow Monthly Pass',
        monthlyPriceCents: Math.round((body.monthlyPrice || 140) * 100),
        includedServicesCount: body.includedServicesCount || 2,
        discountPercentRetail: body.discountPercentRetail || 15,
      })
      .returning();

    return NextResponse.json({ membership: newMem }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating membership:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
