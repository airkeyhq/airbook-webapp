import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { waitlists, services, staff } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/waitlists - List active queue and walk-in guests for workspace
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    let rows = await db
      .select()
      .from(waitlists)
      .where(eq(waitlists.workspaceId, workspaceId))
      .orderBy(asc(waitlists.position), desc(waitlists.createdAt));

    // Seed default walk-in guests in dev mode if empty
    if (rows.length === 0 && process.env.NODE_ENV !== 'production') {
      const defaultWalkins = [
        {
          clientName: 'Alexander Hayes',
          clientPhone: '+1 (555) 234-8891',
          clientEmail: 'alex.hayes@example.com',
          serviceName: 'Skin Fade & Beard Sculpt',
          staffName: 'Elena Rostova',
          estimatedWaitMinutes: 0,
          position: 1,
          status: 'in_chair' as const,
          notes: 'Regular client. Prefers razor finish.',
        },
        {
          clientName: 'Julian Vance',
          clientPhone: '+1 (555) 345-9922',
          clientEmail: 'julian.v@example.com',
          serviceName: 'Executive Precision Cut',
          staffName: 'Marcus Vance',
          estimatedWaitMinutes: 10,
          position: 2,
          status: 'waiting' as const,
          notes: 'Walk-in guest. Checked in via front iPad.',
        },
        {
          clientName: 'Sofia Delgado',
          clientPhone: '+1 (555) 456-1133',
          clientEmail: 'sofia.d@example.com',
          serviceName: 'Balayage & Gloss Treatment',
          staffName: 'First Available Specialist',
          estimatedWaitMinutes: 25,
          position: 3,
          status: 'waiting' as const,
          notes: 'Requested consultation first.',
        },
      ];

      for (const w of defaultWalkins) {
        await db.insert(waitlists).values({
          workspaceId,
          ...w,
        });
      }

      rows = await db
        .select()
        .from(waitlists)
        .where(eq(waitlists.workspaceId, workspaceId))
        .orderBy(asc(waitlists.position), desc(waitlists.createdAt));
    }

    return NextResponse.json({ success: true, waitlists: rows });
  } catch (err: any) {
    console.error('Error fetching waitlist:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch waitlists.' }, { status: 500 });
  }
}

// POST /api/waitlists - Check in new walk-in guest
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);
    const { clientName, clientEmail, clientPhone, serviceId, serviceName, staffId, staffName, notes, estimatedWaitMinutes } = body;

    if (!clientName?.trim()) {
      return NextResponse.json({ error: 'Guest name is required.' }, { status: 400 });
    }

    // Determine next position
    const existingWaiting = await db
      .select()
      .from(waitlists)
      .where(eq(waitlists.workspaceId, workspaceId));

    const nextPos = existingWaiting.filter(w => w.status === 'waiting').length + 1;

    const [entry] = await db
      .insert(waitlists)
      .values({
        workspaceId,
        clientName: clientName.trim(),
        clientEmail: clientEmail?.trim() || undefined,
        clientPhone: clientPhone?.trim() || undefined,
        serviceId: serviceId || undefined,
        serviceName: serviceName?.trim() || 'General Consultation',
        staffId: staffId || undefined,
        staffName: staffName?.trim() || 'First Available Specialist',
        estimatedWaitMinutes: Number(estimatedWaitMinutes) || 15,
        position: nextPos,
        notes: notes?.trim() || undefined,
        status: 'waiting',
      })
      .returning();

    return NextResponse.json({ success: true, waitlist: entry, message: `${clientName} added to the live queue.` }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating waitlist entry:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create waitlist entry.' }, { status: 500 });
  }
}

// PATCH /api/waitlists - Update guest status (Seat in chair, complete, cancel)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, staffName, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required.' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = { status };
    if (status === 'in_chair') {
      updatePayload.servedAt = new Date();
      updatePayload.estimatedWaitMinutes = 0;
    }
    if (staffName) updatePayload.staffName = staffName;
    if (notes !== undefined) updatePayload.notes = notes;

    const [updated] = await db
      .update(waitlists)
      .set(updatePayload)
      .where(eq(waitlists.id, id))
      .returning();

    return NextResponse.json({ success: true, waitlist: updated, message: `Guest status updated to ${status}.` });
  } catch (err: any) {
    console.error('Error updating waitlist entry:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update waitlist.' }, { status: 500 });
  }
}

// DELETE /api/waitlists - Remove guest from queue
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    await db.delete(waitlists).where(eq(waitlists.id, id));

    return NextResponse.json({ success: true, message: 'Guest removed from queue.' });
  } catch (err: any) {
    console.error('Error removing waitlist entry:', err);
    return NextResponse.json({ error: err?.message || 'Failed to remove waitlist.' }, { status: 500 });
  }
}
