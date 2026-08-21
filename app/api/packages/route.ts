import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { packages, services } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/packages - List packages for workspace
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    let list = await db
      .select()
      .from(packages)
      .where(eq(packages.workspaceId, workspaceId))
      .orderBy(desc(packages.createdAt));

    // Seed default multi-session packages in dev mode if empty
    if (list.length === 0 && process.env.NODE_ENV !== 'production') {
      const defaultPackages = [
        {
          name: '5x Precision Haircut & Beard Care',
          serviceName: 'Haircut & Styling',
          totalSessions: 5,
          priceCents: 22500,
          discountPercent: 15,
          validityDays: 365,
          isActive: true,
        },
        {
          name: '10x Deep Recovery Massage Pass',
          serviceName: 'Full Body Massage',
          totalSessions: 10,
          priceCents: 85000,
          discountPercent: 20,
          validityDays: 365,
          isActive: true,
        },
        {
          name: '3x Glow Facial & Skin Rejuvenation',
          serviceName: 'HydraFacial Treatment',
          totalSessions: 3,
          priceCents: 39000,
          discountPercent: 15,
          validityDays: 180,
          isActive: true,
        },
      ];

      for (const pkg of defaultPackages) {
        await db.insert(packages).values({
          workspaceId,
          ...pkg,
        });
      }

      list = await db
        .select()
        .from(packages)
        .where(eq(packages.workspaceId, workspaceId))
        .orderBy(desc(packages.createdAt));
    }

    return NextResponse.json({ success: true, packages: list });
  } catch (error: any) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/packages - Create a new multi-session package
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const priceCents = Math.round((Number(body.price) || Number(body.priceCents) / 100 || 150) * 100);

    const [newPkg] = await db
      .insert(packages)
      .values({
        workspaceId,
        name: body.name?.trim() || 'Service Bundle Pass',
        serviceId: body.serviceId || null,
        serviceName: body.serviceName?.trim() || null,
        totalSessions: Number(body.totalSessions) || 5,
        priceCents,
        discountPercent: Number(body.discountPercent) || 15,
        validityDays: Number(body.validityDays) || 365,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      })
      .returning();

    return NextResponse.json({ success: true, package: newPkg }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating package:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/packages - Update package
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, serviceName, serviceId, totalSessions, price, discountPercent, validityDays, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing package ID.' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (name !== undefined) updatePayload.name = name.trim();
    if (serviceName !== undefined) updatePayload.serviceName = serviceName.trim();
    if (serviceId !== undefined) updatePayload.serviceId = serviceId;
    if (totalSessions !== undefined) updatePayload.totalSessions = Number(totalSessions);
    if (price !== undefined) updatePayload.priceCents = Math.round(Number(price) * 100);
    if (discountPercent !== undefined) updatePayload.discountPercent = Number(discountPercent);
    if (validityDays !== undefined) updatePayload.validityDays = Number(validityDays);
    if (isActive !== undefined) updatePayload.isActive = Boolean(isActive);

    const [updated] = await db
      .update(packages)
      .set(updatePayload)
      .where(eq(packages.id, id))
      .returning();

    return NextResponse.json({ success: true, package: updated });
  } catch (error: any) {
    console.error('Error updating package:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// DELETE /api/packages - Delete package
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing package ID.' }, { status: 400 });
    }

    await db.delete(packages).where(eq(packages.id, id));
    return NextResponse.json({ success: true, message: 'Package removed.' });
  } catch (error: any) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
