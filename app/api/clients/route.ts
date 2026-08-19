import { NextResponse } from 'next/server';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { eq, ilike, or, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const query = searchParams.get('query');

    const conditions = [];
    if (workspaceId) {
      conditions.push(eq(clients.workspaceId, workspaceId));
    }

    if (query) {
      conditions.push(
        or(
          ilike(clients.name, `%${query}%`),
          ilike(clients.email, `%${query}%`),
          ilike(clients.phone, `%${query}%`)
        )
      );
    }

    const clientList = await db
      .select()
      .from(clients)
      .where(conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : undefined) : undefined)
      .orderBy(desc(clients.createdAt));

    return NextResponse.json({ success: true, clients: clientList });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch clients.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, name, email, phone, notes } = body;

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
    const { id, name, email, phone, notes, medicalWaiversSigned } = body;

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (name) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (notes !== undefined) updateFields.notes = notes;
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
