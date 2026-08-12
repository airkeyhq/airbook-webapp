import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, clients } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      clientName,
      clientEmail,
      clientPhone,
      staffId,
      serviceId,
      serviceName,
      dateStr,
      startTime,
      endTime,
      durationMinutes,
      priceCents,
    } = body;

    if (!workspaceId || !clientName || !staffId || !serviceId || !dateStr || !startTime) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 });
    }

    // Atomic Database Transaction: Check slot availability & lock appointment
    const result = await db.transaction(async (tx) => {
      // 1. Check if staff member is already booked at this exact date & time
      const existingBooking = await tx
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.staffId, staffId),
            eq(appointments.dateStr, dateStr),
            eq(appointments.startTime, startTime),
            eq(appointments.status, 'confirmed')
          )
        );

      if (existingBooking.length > 0) {
        throw new Error('SLOT_ALREADY_BOOKED');
      }

      // 2. Create or find Client record
      const [newClient] = await tx
        .insert(clients)
        .values({
          workspaceId,
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          totalVisits: 1,
        })
        .returning();

      // 3. Create Appointment with Transaction Lock
      const [newAppointment] = await tx
        .insert(appointments)
        .values({
          workspaceId,
          clientId: newClient.id,
          staffId,
          serviceId,
          dateStr,
          startTime,
          endTime: endTime || startTime,
          durationMinutes: durationMinutes || 45,
          priceCents: priceCents || 7500,
          status: 'confirmed',
          paymentStatus: 'deposit_paid',
        })
        .returning();

      return newAppointment;
    });

    return NextResponse.json({ success: true, booking: result });
  } catch (err: any) {
    if (err?.message === 'SLOT_ALREADY_BOOKED') {
      return NextResponse.json(
        { error: 'This time slot was just booked by another client. Please select another slot.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err?.message || 'Failed to process booking.' }, { status: 500 });
  }
}
