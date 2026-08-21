import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, clients } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { randomUUID } from 'crypto';

function addMinutesToTime(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const eh = Math.floor(total / 60) % 24;
  const em = total % 60;
  return `${eh.toString().padStart(2, '0')}:${em.toString().padStart(2, '0')}`;
}

interface GuestInput {
  guestName?: string;
  staffId: string;
  serviceId: string;
  durationMinutes?: number;
  priceCents?: number;
  price?: number;
  startTime?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      workspaceId: providedWorkspaceId,
      clientName,
      clientEmail,
      clientPhone,
      dateStr,
      startTime,
      notes,
    } = body;

    // Accept either a multi-guest `guests[]` array (party booking) or the
    // legacy single-guest shape (staffId/serviceId at the top level).
    const rawGuests: GuestInput[] = Array.isArray(body.guests) && body.guests.length > 0
      ? body.guests
      : [
          {
            guestName: clientName,
            staffId: body.staffId,
            serviceId: body.serviceId,
            durationMinutes: body.durationMinutes,
            priceCents: body.priceCents,
            price: body.price,
            startTime: body.startTime,
          },
        ];

    if (!clientName || !dateStr || !startTime || rawGuests.length === 0) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 });
    }
    if (rawGuests.some((g) => !g.staffId || !g.serviceId)) {
      return NextResponse.json({ error: 'Every guest needs a staff member and a service.' }, { status: 400 });
    }

    const workspaceId = await getActiveWorkspaceId(providedWorkspaceId);
    const isParty = rawGuests.length > 1;
    const groupId = isParty ? randomUUID() : null;

    const guests = rawGuests.map((g) => {
      const duration = g.durationMinutes || 45;
      const priceCents = g.priceCents ?? (g.price !== undefined ? Math.round(Number(g.price) * 100) : 7500);
      const guestStart = g.startTime || startTime;
      return {
        guestName: g.guestName?.trim() || clientName,
        staffId: g.staffId,
        serviceId: g.serviceId,
        durationMinutes: duration,
        priceCents,
        startTime: guestStart,
        endTime: addMinutesToTime(guestStart, duration),
      };
    });

    // Atomic Database Transaction: check every guest's slot & create the whole party together
    const result = await db.transaction(async (tx) => {
      for (const guest of guests) {
        const existingBooking = await tx
          .select()
          .from(appointments)
          .where(
            and(
              eq(appointments.staffId, guest.staffId),
              eq(appointments.dateStr, dateStr),
              eq(appointments.startTime, guest.startTime),
              eq(appointments.status, 'confirmed')
            )
          );

        if (existingBooking.length > 0) {
          throw new Error('SLOT_ALREADY_BOOKED');
        }
      }

      const createdAppointments = [];
      for (const guest of guests) {
        const [newClient] = await tx
          .insert(clients)
          .values({
            workspaceId,
            name: guest.guestName,
            email: clientEmail,
            phone: clientPhone,
            totalVisits: 1,
          })
          .returning();

        const [newAppointment] = await tx
          .insert(appointments)
          .values({
            workspaceId,
            clientId: newClient.id,
            staffId: guest.staffId,
            serviceId: guest.serviceId,
            groupId,
            dateStr,
            startTime: guest.startTime,
            endTime: guest.endTime,
            durationMinutes: guest.durationMinutes,
            priceCents: guest.priceCents,
            status: 'confirmed',
            paymentStatus: 'pending',
            notes: notes || null,
          })
          .returning();

        createdAppointments.push({ ...newAppointment, guestName: guest.guestName });
      }

      return createdAppointments;
    });

    return NextResponse.json({
      success: true,
      booking: result[0],
      bookings: result,
      groupId,
    });
  } catch (err: any) {
    if (err?.message === 'SLOT_ALREADY_BOOKED') {
      return NextResponse.json(
        { error: 'One of the selected time slots was just booked by another client. Please choose another time.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err?.message || 'Failed to process booking.' }, { status: 500 });
  }
}
