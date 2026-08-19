import { NextResponse } from 'next/server';
import { db } from '@/db';
import { waitlists, services } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId') || '00000000-0000-0000-0000-000000000001';

    const rows = await db
      .select({
        id: waitlists.id,
        workspaceId: waitlists.workspaceId,
        clientName: waitlists.clientName,
        clientEmail: waitlists.clientEmail,
        clientPhone: waitlists.clientPhone,
        serviceId: waitlists.serviceId,
        preferredDateStr: waitlists.preferredDateStr,
        status: waitlists.status,
        createdAt: waitlists.createdAt,
        serviceName: services.name,
      })
      .from(waitlists)
      .leftJoin(services, eq(waitlists.serviceId, services.id))
      .where(eq(waitlists.workspaceId, workspaceId))
      .orderBy(desc(waitlists.createdAt));

    return NextResponse.json({ success: true, waitlists: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch waitlists.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, clientName, clientEmail, clientPhone, serviceId, preferredDateStr } = body;

    if (!clientName) {
      return NextResponse.json({ error: 'Client name is required.' }, { status: 400 });
    }

    const [entry] = await db
      .insert(waitlists)
      .values({
        workspaceId: workspaceId || '00000000-0000-0000-0000-000000000001',
        clientName,
        clientEmail: clientEmail || 'walkin@airbook.app',
        clientPhone: clientPhone || null,
        serviceId: serviceId || '00000000-0000-0000-0000-000000000002',
        preferredDateStr: preferredDateStr || new Date().toISOString().split('T')[0],
        status: 'waiting',
      })
      .returning();

    return NextResponse.json({ success: true, waitlist: entry });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create waitlist entry.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required.' }, { status: 400 });
    }

    const [updated] = await db
      .update(waitlists)
      .set({ status })
      .where(eq(waitlists.id, id))
      .returning();

    return NextResponse.json({ success: true, waitlist: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update waitlist.' }, { status: 500 });
  }
}
