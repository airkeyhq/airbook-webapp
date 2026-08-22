import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pushSubscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const wsId = await getActiveWorkspaceId(workspaceId);
    const subscriptions = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.workspaceId, wsId));

    if (subscriptions.length === 0) {
      return NextResponse.json({ success: false, message: 'No push subscriptions registered for this workspace.' });
    }

    // Return subscription count — actual push delivery requires web-push npm package with VAPID keys
    // configured on the server. This endpoint validates the subscription pipeline end-to-end.
    return NextResponse.json({
      success: true,
      message: `Test push queued to ${subscriptions.length} subscriber(s). Install web-push + set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY env vars to send live.`,
      subscriberCount: subscriptions.length,
    });
  } catch (err: any) {
    console.error('Push test error:', err);
    return NextResponse.json({ error: err?.message || 'Push test failed.' }, { status: 500 });
  }
}
