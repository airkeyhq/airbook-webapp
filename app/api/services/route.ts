import { NextResponse } from 'next/server';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    let serviceList = await db
      .select()
      .from(services)
      .where(workspaceId ? eq(services.workspaceId, workspaceId) : undefined)
      .orderBy(desc(services.createdAt));

    if (serviceList.length === 0 && workspaceId && process.env.NODE_ENV !== 'production') {
      const defaultServices = [
        { name: 'Haircut & Precision Styling', category: 'Hair & Styling', durationMinutes: 45, priceCents: 7500, colorTag: '#FF4D8D' },
        { name: 'Beard Sculpting & Hot Towel', category: 'Beard & Grooming', durationMinutes: 30, priceCents: 4500, colorTag: '#00C7BE' },
        { name: 'HydraFacial Glow Treatment', category: 'Spa & Facial', durationMinutes: 60, priceCents: 16000, colorTag: '#9D50BB' },
        { name: 'Deep Tissue Body Therapy', category: 'Body Wellness', durationMinutes: 60, priceCents: 13000, colorTag: '#34C759' },
        { name: 'Botox & Aesthetic Consultation', category: 'Aesthetics', durationMinutes: 30, priceCents: 22000, colorTag: '#FF9500' },
      ];

      for (const srv of defaultServices) {
        const [created] = await db
          .insert(services)
          .values({
            workspaceId,
            name: srv.name,
            category: srv.category,
            durationMinutes: srv.durationMinutes,
            priceCents: srv.priceCents,
            colorTag: srv.colorTag,
            depositCents: Math.round(srv.priceCents * 0.2),
            isActive: true,
          })
          .returning();
        serviceList.push(created);
      }
    }

    return NextResponse.json({ success: true, services: serviceList });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch services.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, name, category, durationMinutes, priceCents, depositCents, colorTag, description } = body;

    if (!name || !durationMinutes || priceCents === undefined) {
      return NextResponse.json({ error: 'Name, duration, and price are required.' }, { status: 400 });
    }

    const activeWorkspaceId = await getActiveWorkspaceId(workspaceId);

    const [newService] = await db
      .insert(services)
      .values({
        workspaceId: activeWorkspaceId,
        name,
        category: category || 'Hair',
        durationMinutes: Number(durationMinutes),
        priceCents: Number(priceCents),
        depositCents: depositCents ? Number(depositCents) : Math.round(Number(priceCents) * 0.2),
        colorTag: colorTag || '#007AFF',
        description: description || null,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ success: true, service: newService });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create service.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, category, durationMinutes, priceCents, depositCents, colorTag, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (name) updateFields.name = name;
    if (category) updateFields.category = category;
    if (durationMinutes !== undefined) updateFields.durationMinutes = Number(durationMinutes);
    if (priceCents !== undefined) updateFields.priceCents = Number(priceCents);
    if (depositCents !== undefined) updateFields.depositCents = Number(depositCents);
    if (colorTag) updateFields.colorTag = colorTag;
    if (isActive !== undefined) updateFields.isActive = isActive;

    const [updated] = await db
      .update(services)
      .set(updateFields)
      .where(eq(services.id, id))
      .returning();

    return NextResponse.json({ success: true, service: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update service.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    await db.delete(services).where(eq(services.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete service.' }, { status: 500 });
  }
}
