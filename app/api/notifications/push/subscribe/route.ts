import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pushSubscriptions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, workspaceId } = body;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid push subscription object.' }, { status: 400 });
    }
    const wsId = await getActiveWorkspaceId(workspaceId);
    const userAgent = req.headers.get('user-agent') || '';

    // Upsert: remove old subscription with same endpoint, then insert fresh
    await db.delete(pushSubscriptions).where(
      and(eq(pushSubscriptions.workspaceId, wsId), eq(pushSubscriptions.endpoint, subscription.endpoint))
    ).catch(() => {});

    await db.insert(pushSubscriptions).values({
      workspaceId: wsId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userAgent,
    });

    return NextResponse.json({ success: true, message: 'Push subscription saved.' });
  } catch (err: any) {
    console.error('Push subscription error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save push subscription.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const endpoint = searchParams.get('endpoint');
    if (!endpoint) return NextResponse.json({ error: 'endpoint required.' }, { status: 400 });
    const wsId = await getActiveWorkspaceId(workspaceId);
    await db.delete(pushSubscriptions).where(
      and(eq(pushSubscriptions.workspaceId, wsId), eq(pushSubscriptions.endpoint, endpoint))
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to remove push subscription.' }, { status: 500 });
  }
}
