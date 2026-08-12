import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, clients, services, staff } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const dateStr = searchParams.get('dateStr');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const conditions = [];

    if (workspaceId) {
      conditions.push(eq(appointments.workspaceId, workspaceId));
    }
    if (dateStr) {
      conditions.push(eq(appointments.dateStr, dateStr));
    } else if (startDate && endDate) {
      conditions.push(gte(appointments.dateStr, startDate));
      conditions.push(lte(appointments.dateStr, endDate));
    }

    const rows = await db
      .select({
        id: appointments.id,
        workspaceId: appointments.workspaceId,
        dateStr: appointments.dateStr,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        durationMinutes: appointments.durationMinutes,
        priceCents: appointments.priceCents,
        status: appointments.status,
        paymentStatus: appointments.paymentStatus,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        client: {
          id: clients.id,
          name: clients.name,
          email: clients.email,
          phone: clients.phone,
        },
        service: {
          id: services.id,
          name: services.name,
          colorTag: services.colorTag,
          category: services.category,
        },
        staff: {
          id: staff.id,
          name: staff.name,
          role: staff.role,
          avatarEmoji: staff.avatarEmoji,
        },
      })
      .from(appointments)
      .leftJoin(clients, eq(appointments.clientId, clients.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(staff, eq(appointments.staffId, staff.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json({ success: true, appointments: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch appointments.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, notes, startTime, dateStr, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (startTime) updateFields.startTime = startTime;
    if (dateStr) updateFields.dateStr = dateStr;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const [updated] = await db
      .update(appointments)
      .set(updateFields)
      .where(eq(appointments.id, id))
      .returning();

    return NextResponse.json({ success: true, appointment: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update appointment.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required.' }, { status: 400 });
    }

    await db.delete(appointments).where(eq(appointments.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete appointment.' }, { status: 500 });
  }
}
