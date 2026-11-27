import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { appointments, clients, gift_cards, services, staff, workspaces } from '@/db/schema';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { CLIENT_SESSION_COOKIE, verifyClientSession } from '@/lib/client-session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CLIENT_SESSION_COOKIE)?.value;
    const session = verifyClientSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.email.toLowerCase();

    const clientRows = await db
      .select({
        id: clients.id,
        name: clients.name,
        email: clients.email,
        workspaceId: clients.workspaceId,
        workspaceName: workspaces.name,
        workspaceSlug: workspaces.slug,
        totalVisits: clients.totalVisits,
        totalSpentCents: clients.totalSpentCents,
        walletBalanceCents: clients.walletBalanceCents,
      })
      .from(clients)
      .innerJoin(workspaces, eq(clients.workspaceId, workspaces.id))
      .where(sql`LOWER(${clients.email}) = ${email}`);

    const clientIds = clientRows.map((c) => c.id);

    const bookings =
      clientIds.length > 0
        ? await db
            .select({
              id: appointments.id,
              dateStr: appointments.dateStr,
              startTime: appointments.startTime,
              durationMinutes: appointments.durationMinutes,
              priceCents: appointments.priceCents,
              status: appointments.status,
              workspaceName: workspaces.name,
              workspaceSlug: workspaces.slug,
              serviceName: services.name,
              staffName: staff.name,
            })
            .from(appointments)
            .innerJoin(workspaces, eq(appointments.workspaceId, workspaces.id))
            .leftJoin(services, eq(appointments.serviceId, services.id))
            .leftJoin(staff, eq(appointments.staffId, staff.id))
            .where(inArray(appointments.clientId, clientIds))
            .orderBy(desc(appointments.dateStr), desc(appointments.startTime))
            .limit(40)
        : [];

    const activeGiftCards = await db
      .select({
        id: gift_cards.id,
        code: gift_cards.code,
        currentBalanceCents: gift_cards.currentBalanceCents,
        workspaceName: workspaces.name,
      })
      .from(gift_cards)
      .innerJoin(workspaces, eq(gift_cards.workspaceId, workspaces.id))
      .where(and(sql`LOWER(${gift_cards.recipientEmail}) = ${email}`, eq(gift_cards.status, 'active')));

    const totalVisits = clientRows.reduce((s, c) => s + (c.totalVisits || 0), 0);
    const totalSpentCents = clientRows.reduce((s, c) => s + (c.totalSpentCents || 0), 0);
    const walletBalanceCents = clientRows.reduce((s, c) => s + (c.walletBalanceCents || 0), 0);
    const loyaltyPoints = totalVisits * 10 + Math.floor(totalSpentCents / 100);
    const loyaltyTier =
      loyaltyPoints >= 1000 ? 'VIP' : loyaltyPoints >= 400 ? 'Gold' : loyaltyPoints >= 150 ? 'Silver' : 'Bronze';

    return NextResponse.json({
      success: true,
      profile: {
        email,
        name: clientRows[0]?.name || email.split('@')[0],
        totalVisits,
        totalSpentCents,
        walletBalanceCents,
        loyaltyPoints,
        loyaltyTier,
      },
      bookings,
      giftCards: activeGiftCards,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to load client portal.' }, { status: 500 });
  }
}
