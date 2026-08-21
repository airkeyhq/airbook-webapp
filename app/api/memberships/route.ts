import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { memberships } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/memberships - List membership tiers for workspace
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    let list = await db
      .select()
      .from(memberships)
      .where(eq(memberships.workspaceId, workspaceId))
      .orderBy(desc(memberships.createdAt));

    // Seed default tiers in dev mode if empty
    if (list.length === 0 && process.env.NODE_ENV !== 'production') {
      const defaultTiers = [
        {
          name: 'VIP Platinum Unlimited Pass',
          monthlyPriceCents: 19900,
          includedServicesCount: 4,
          discountPercentRetail: 20,
          perks: 'Priority Booking · Complimentary Beverages · 20% Off All Retail · Free Scalp Massage',
          isActive: true,
        },
        {
          name: 'Gold Styling Club',
          monthlyPriceCents: 11900,
          includedServicesCount: 2,
          discountPercentRetail: 15,
          perks: '2 Monthly Cuts or Treatments · 15% Off All Retail · Dedicated Specialist Reservation',
          isActive: true,
        },
        {
          name: 'Silver Maintenance Pass',
          monthlyPriceCents: 6900,
          includedServicesCount: 1,
          discountPercentRetail: 10,
          perks: '1 Monthly Routine Session · 10% Off All Retail',
          isActive: true,
        },
      ];

      for (const tier of defaultTiers) {
        await db.insert(memberships).values({
          workspaceId,
          ...tier,
        });
      }

      list = await db
        .select()
        .from(memberships)
        .where(eq(memberships.workspaceId, workspaceId))
        .orderBy(desc(memberships.createdAt));
    }

    return NextResponse.json({ success: true, memberships: list });
  } catch (error: any) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/memberships - Create a new membership tier
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const [newMem] = await db
      .insert(memberships)
      .values({
        workspaceId,
        name: body.name?.trim() || 'VIP Club Pass',
        monthlyPriceCents: Math.round((Number(body.monthlyPrice) || Number(body.price) || 120) * 100),
        includedServicesCount: Number(body.includedServicesCount) || 2,
        discountPercentRetail: Number(body.discountPercentRetail) || 15,
        perks: body.perks?.trim() || null,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      })
      .returning();

    return NextResponse.json({ success: true, membership: newMem }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating membership:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/memberships - Update membership tier
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, monthlyPrice, includedServicesCount, discountPercentRetail, perks, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing membership ID.' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (name !== undefined) updatePayload.name = name.trim();
    if (monthlyPrice !== undefined) updatePayload.monthlyPriceCents = Math.round(Number(monthlyPrice) * 100);
    if (includedServicesCount !== undefined) updatePayload.includedServicesCount = Number(includedServicesCount);
    if (discountPercentRetail !== undefined) updatePayload.discountPercentRetail = Number(discountPercentRetail);
    if (perks !== undefined) updatePayload.perks = perks?.trim() || null;
    if (isActive !== undefined) updatePayload.isActive = Boolean(isActive);

    const [updated] = await db
      .update(memberships)
      .set(updatePayload)
      .where(eq(memberships.id, id))
      .returning();

    return NextResponse.json({ success: true, membership: updated });
  } catch (error: any) {
    console.error('Error updating membership:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// DELETE /api/memberships - Delete membership tier
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing membership ID.' }, { status: 400 });
    }

    await db.delete(memberships).where(eq(memberships.id, id));
    return NextResponse.json({ success: true, message: 'Membership tier removed.' });
  } catch (error: any) {
    console.error('Error deleting membership:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
