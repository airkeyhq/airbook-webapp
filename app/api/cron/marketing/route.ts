import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, clients, services, staff, workspaces } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { sendGoogleReviewRequestEmail, sendReengagementEmail } from '@/lib/notifications';

function dateDaysAgoStr(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 86400000);
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.get('authorization');
      if (auth !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const yesterdayStr = dateDaysAgoStr(1);
    const threeWeeksAgoStr = dateDaysAgoStr(21);

    // 1. Post-visit Google Review requests (completed yesterday)
    const recentCompleted = await db
      .select({
        clientName: clients.name,
        clientEmail: clients.email,
        workspaceName: workspaces.name,
        googleReviewUrl: workspaces.googleReviewUrl,
        serviceName: services.name,
        staffName: staff.name,
      })
      .from(appointments)
      .innerJoin(workspaces, eq(appointments.workspaceId, workspaces.id))
      .innerJoin(clients, eq(appointments.clientId, clients.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(staff, eq(appointments.staffId, staff.id))
      .where(and(eq(appointments.dateStr, yesterdayStr), eq(appointments.status, 'completed')));

    let reviewsSent = 0;
    for (const row of recentCompleted) {
      if (!row.clientEmail || !row.googleReviewUrl) continue;
      await sendGoogleReviewRequestEmail({
        email: row.clientEmail,
        clientName: row.clientName,
        workspaceName: row.workspaceName,
        serviceName: row.serviceName || 'Appointment',
        staffName: row.staffName || 'Specialist',
        reviewUrl: row.googleReviewUrl,
      });
      reviewsSent += 1;
    }

    // 2. 3-Week Rebooking nudges (completed 21 days ago)
    const rebookCandidates = await db
      .select({
        clientName: clients.name,
        clientEmail: clients.email,
        workspaceName: workspaces.name,
        workspaceSlug: workspaces.slug,
        serviceName: services.name,
        staffName: staff.name,
      })
      .from(appointments)
      .innerJoin(workspaces, eq(appointments.workspaceId, workspaces.id))
      .innerJoin(clients, eq(appointments.clientId, clients.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(staff, eq(appointments.staffId, staff.id))
      .where(and(eq(appointments.dateStr, threeWeeksAgoStr), eq(appointments.status, 'completed')));

    let rebooksSent = 0;
    for (const row of rebookCandidates) {
      if (!row.clientEmail) continue;
      await sendReengagementEmail({
        email: row.clientEmail,
        clientName: row.clientName,
        workspaceName: row.workspaceName,
        lastServiceName: row.serviceName || 'Visit',
        lastStaffName: row.staffName || 'Specialist',
        promoCode: 'COMEBACK10',
        bookingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/book/${row.workspaceSlug}`,
      });
      rebooksSent += 1;
    }

    return NextResponse.json({
      success: true,
      reviewsSent,
      rebooksSent,
      checkedDates: { yesterdayStr, threeWeeksAgoStr },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Marketing cron failed.' }, { status: 500 });
  }
}
