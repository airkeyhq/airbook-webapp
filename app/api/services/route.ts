import { NextResponse } from 'next/server';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    const serviceList = await db
      .select()
      .from(services)
      .where(workspaceId ? eq(services.workspaceId, workspaceId) : undefined)
      .orderBy(desc(services.createdAt));

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

    const [newService] = await db
      .insert(services)
      .values({
        workspaceId: workspaceId || '00000000-0000-0000-0000-000000000001',
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
