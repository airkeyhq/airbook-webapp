import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, clients, services, staff, invoices, waitlists, workspaces } from '@/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import {
  sendCancellationNotification,
  sendRescheduledNotification,
  sendWaitlistChairReadyNotification,
} from '@/lib/notifications';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const workspaceId = searchParams.get('workspaceId');
    const dateStr = searchParams.get('dateStr');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const groupId = searchParams.get('groupId');

    const conditions = [];

    if (id) {
      conditions.push(eq(appointments.id, id));
    }
    if (workspaceId) {
      conditions.push(eq(appointments.workspaceId, workspaceId));
    }
    if (groupId) {
      conditions.push(eq(appointments.groupId, groupId));
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
        groupId: appointments.groupId,
        dateStr: appointments.dateStr,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        durationMinutes: appointments.durationMinutes,
        priceCents: appointments.priceCents,
        status: appointments.status,
        paymentStatus: appointments.paymentStatus,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        workspace: {
          name: workspaces.name,
          slug: workspaces.slug,
        },
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
      .leftJoin(workspaces, eq(appointments.workspaceId, workspaces.id))
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
    const { id, status, notes, startTime, dateStr, paymentStatus, chargeNoShowFee, feeCents } = body;

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (startTime) updateFields.startTime = startTime;
    if (dateStr) updateFields.dateStr = dateStr;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (status === 'no_show' && chargeNoShowFee) {
      updateFields.paymentStatus = 'paid';
    }

    const [updated] = await db
      .update(appointments)
      .set(updateFields)
      .where(eq(appointments.id, id))
      .returning();

    // Increment client noShowCount and record no-show fee invoice if requested
    if (status === 'no_show' && updated) {
      if (updated.clientId) {
        await db
          .update(clients)
          .set({ noShowCount: sql`${clients.noShowCount} + 1` })
          .where(eq(clients.id, updated.clientId));
      }
      if (chargeNoShowFee) {
        const amountCents = typeof feeCents === 'number' && feeCents > 0 ? feeCents : updated.priceCents;
        if (amountCents > 0) {
          await db.insert(invoices).values({
            workspaceId: updated.workspaceId,
            clientId: updated.clientId,
            appointmentId: updated.id,
            subtotalCents: amountCents,
            tipCents: 0,
            taxCents: 0,
            discountCents: 0,
            totalCents: amountCents,
            paymentMethod: 'no_show_fee',
            receiptNumber: `NOSHOW-${Date.now().toString(36).toUpperCase()}`,
            status: 'paid',
          });
        }
      }
    }

    // If appointment was cancelled, dispatch cancellation + waitlist auto-fill notifications
    if (status === 'cancelled' && updated) {
      (async () => {
        try {
          const [details] = await db
            .select({
              clientName: clients.name,
              clientEmail: clients.email,
              clientPhone: clients.phone,
              serviceName: services.name,
              staffName: staff.name,
              workspaceName: workspaces.name,
              workspaceSlug: workspaces.slug,
            })
            .from(appointments)
            .leftJoin(workspaces, eq(appointments.workspaceId, workspaces.id))
            .leftJoin(clients, eq(appointments.clientId, clients.id))
            .leftJoin(services, eq(appointments.serviceId, services.id))
            .leftJoin(staff, eq(appointments.staffId, staff.id))
            .where(eq(appointments.id, id))
            .limit(1);

          if (details && (details.clientEmail || details.clientPhone)) {
            await sendCancellationNotification({
              subscriberId: details.clientEmail || details.clientPhone || `sub_${updated.clientId}`,
              clientName: details.clientName || 'Client',
              clientEmail: details.clientEmail || undefined,
              clientPhone: details.clientPhone || undefined,
              serviceName: details.serviceName || 'Service',
              staffName: details.staffName || 'Specialist',
              dateStr: updated.dateStr,
              startTime: updated.startTime,
              reason: notes || 'Cancelled',
            });
          }

          // Waitlist auto-fill: notify up to 3 waiting guests in this workspace
          const waitingGuests = await db
            .select()
            .from(waitlists)
            .where(and(eq(waitlists.workspaceId, updated.workspaceId), eq(waitlists.status, 'waiting')))
            .limit(3);

          for (const guest of waitingGuests) {
            if (!guest.clientEmail) continue;
            await sendWaitlistChairReadyNotification({
              email: guest.clientEmail,
              clientName: guest.clientName,
              workspaceName: details?.workspaceName || 'AirBook Studio',
              serviceName: guest.serviceName || details?.serviceName || 'Appointment Slot',
              staffName: guest.staffName || details?.staffName || 'Specialist',
              claimUrl: details?.workspaceSlug
                ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/book/${details.workspaceSlug}`
                : undefined,
            });
          }
        } catch (e) {
          console.warn('Failed to send cancellation / waitlist auto-fill notification:', e);
        }
      })();
    }

    // If appointment was rescheduled, notify the client
    if ((startTime || dateStr) && status !== 'cancelled' && updated) {
      (async () => {
        try {
          const [details] = await db
            .select({
              clientName: clients.name,
              clientEmail: clients.email,
              serviceName: services.name,
              staffName: staff.name,
              workspaceName: workspaces.name,
            })
            .from(appointments)
            .leftJoin(workspaces, eq(appointments.workspaceId, workspaces.id))
            .leftJoin(clients, eq(appointments.clientId, clients.id))
            .leftJoin(services, eq(appointments.serviceId, services.id))
            .leftJoin(staff, eq(appointments.staffId, staff.id))
            .where(eq(appointments.id, id))
            .limit(1);

          if (details?.clientEmail) {
            await sendRescheduledNotification({
              email: details.clientEmail,
              clientName: details.clientName || 'Client',
              workspaceName: details.workspaceName || 'AirBook Studio',
              serviceName: details.serviceName || 'Service',
              staffName: details.staffName || 'Specialist',
              oldDateStr: updated.dateStr,
              oldStartTime: updated.startTime,
              newDateStr: dateStr || updated.dateStr,
              newStartTime: startTime || updated.startTime,
            });
          }
        } catch (e) {
          console.warn('Failed to send reschedule notification:', e);
        }
      })();
    }

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
