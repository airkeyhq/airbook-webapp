import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { appointments, clients, gift_cards, invoices, services, signed_waivers, staff, workspaces } from '@/db/schema';
import { and, desc, eq, inArray, or, sql } from 'drizzle-orm';
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
        preferences: clients.preferences,
        allergies: clients.allergies,
        customSpecs: clients.customSpecs,
        photos: clients.photos,
        isKycVerified: clients.isKycVerified,
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
              groupId: appointments.groupId,
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

    const receipts =
      clientIds.length > 0
        ? await db
            .select({
              id: invoices.id,
              receiptNumber: invoices.receiptNumber,
              totalCents: invoices.totalCents,
              tipCents: invoices.tipCents,
              paymentMethod: invoices.paymentMethod,
              status: invoices.status,
              createdAt: invoices.createdAt,
              workspaceName: workspaces.name,
            })
            .from(invoices)
            .innerJoin(workspaces, eq(invoices.workspaceId, workspaces.id))
            .where(inArray(invoices.clientId, clientIds))
            .orderBy(desc(invoices.createdAt))
            .limit(30)
        : [];

    const waivers = await db
      .select({
        id: signed_waivers.id,
        templateTitle: signed_waivers.templateTitle,
        createdAt: signed_waivers.createdAt,
        agreedClauses: signed_waivers.agreedClauses,
        workspaceName: workspaces.name,
      })
      .from(signed_waivers)
      .innerJoin(workspaces, eq(signed_waivers.workspaceId, workspaces.id))
      .where(
        clientIds.length > 0
          ? or(sql`LOWER(${signed_waivers.clientEmail}) = ${email}`, inArray(signed_waivers.clientId, clientIds))
          : sql`LOWER(${signed_waivers.clientEmail}) = ${email}`
      )
      .orderBy(desc(signed_waivers.createdAt))
      .limit(20);

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

    const photos = clientRows.flatMap((c) =>
      (c.photos || []).map((p) => ({
        ...p,
        workspaceName: c.workspaceName,
      }))
    );

    const familyMap = new Map<string, { id: string; name: string; relationship: string; notes?: string }>();
    for (const row of clientRows) {
      for (const spec of row.customSpecs || []) {
        if (spec.label?.startsWith('family:')) {
          const relationship = spec.label.slice('family:'.length) || 'Family';
          if (!familyMap.has(spec.id)) {
            familyMap.set(spec.id, {
              id: spec.id,
              name: spec.value,
              relationship,
              notes: spec.date || undefined,
            });
          }
        }
      }
    }
    const familyMembers = Array.from(familyMap.values());

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
        preferences: clientRows.find((c) => c.preferences)?.preferences || '',
        allergies: clientRows.find((c) => c.allergies)?.allergies || '',
        isKycVerified: clientRows.some((c) => c.isKycVerified),
      },
      bookings,
      receipts,
      waivers,
      photos,
      familyMembers,
      giftCards: activeGiftCards,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to load client portal.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CLIENT_SESSION_COOKIE)?.value;
    const session = verifyClientSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const email = session.email.toLowerCase();

    const updateFields: Record<string, any> = {};
    if (typeof body?.preferences === 'string') updateFields.preferences = body.preferences.trim();
    if (typeof body?.allergies === 'string') updateFields.allergies = body.allergies.trim();

    if (Array.isArray(body?.familyMembers)) {
      const existingRows = await db
        .select({ id: clients.id, customSpecs: clients.customSpecs })
        .from(clients)
        .where(sql`LOWER(${clients.email}) = ${email}`);

      const familySpecs = body.familyMembers
        .filter((f: any) => f && typeof f.name === 'string' && f.name.trim())
        .map((f: any) => ({
          id: String(f.id || `fam-${Date.now()}`),
          label: `family:${String(f.relationship || 'Family').trim()}`,
          value: String(f.name).trim(),
          date: f.notes ? String(f.notes).trim() : undefined,
        }));

      for (const row of existingRows) {
        const nonFamily = (row.customSpecs || []).filter((s) => !s.label?.startsWith('family:'));
        await db
          .update(clients)
          .set({ customSpecs: [...nonFamily, ...familySpecs] })
          .where(eq(clients.id, row.id));
      }
    }

    if (Object.keys(updateFields).length > 0) {
      await db
        .update(clients)
        .set(updateFields)
        .where(sql`LOWER(${clients.email}) = ${email}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update client preferences.' }, { status: 500 });
  }
}
