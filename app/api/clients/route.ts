import { NextResponse } from 'next/server';
import { db } from '@/db';
import { clients, appointments } from '@/db/schema';
import { eq, and, ilike, or, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const query = searchParams.get('query');

    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    const whereClause = query
      ? and(
          eq(clients.workspaceId, workspaceId),
          or(
            ilike(clients.name, `%${query}%`),
            ilike(clients.email, `%${query}%`),
            ilike(clients.phone, `%${query}%`)
          )
        )
      : eq(clients.workspaceId, workspaceId);

    let clientList = await db
      .select()
      .from(clients)
      .where(whereClause)
      .orderBy(desc(clients.createdAt));

    return NextResponse.json({ success: true, clients: clientList });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch clients.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      name,
      email,
      phone,
      notes,
      preferences,
      allergies,
      tags,
      customSpecs,
      photos,
      avatarUrl,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Client name is required.' }, { status: 400 });
    }

    const activeWorkspaceId = await getActiveWorkspaceId(workspaceId);

    const [newClient] = await db
      .insert(clients)
      .values({
        workspaceId: activeWorkspaceId,
        name,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
        preferences: preferences || null,
        allergies: allergies || null,
        tags: Array.isArray(tags) ? tags : [],
        customSpecs: Array.isArray(customSpecs) ? customSpecs : [],
        photos: Array.isArray(photos) ? photos : [],
        avatarUrl: avatarUrl || null,
        totalVisits: 0,
        totalSpentCents: 0,
      })
      .returning();

    return NextResponse.json({ success: true, client: newClient });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create client.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      email,
      phone,
      notes,
      preferences,
      allergies,
      tags,
      customSpecs,
      photos,
      avatarUrl,
      medicalWaiversSigned,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (name) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (notes !== undefined) updateFields.notes = notes;
    if (preferences !== undefined) updateFields.preferences = preferences;
    if (allergies !== undefined) updateFields.allergies = allergies;
    if (tags !== undefined) updateFields.tags = Array.isArray(tags) ? tags : [];
    if (customSpecs !== undefined) updateFields.customSpecs = Array.isArray(customSpecs) ? customSpecs : [];
    if (photos !== undefined) updateFields.photos = Array.isArray(photos) ? photos : [];
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;
    if (medicalWaiversSigned !== undefined) updateFields.medicalWaiversSigned = medicalWaiversSigned;

    const [updated] = await db
      .update(clients)
      .set(updateFields)
      .where(eq(clients.id, id))
      .returning();

    return NextResponse.json({ success: true, client: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update client.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required.' }, { status: 400 });
    }

    await db.delete(clients).where(eq(clients.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete client.' }, { status: 500 });
  }
}

