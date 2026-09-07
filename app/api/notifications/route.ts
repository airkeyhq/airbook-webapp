import { NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { sendCustomNotification } from '@/lib/notifications';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const filter = searchParams.get('filter'); // 'all' | 'unread' | 'logs'

    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    const allNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.workspaceId, workspaceId))
      .orderBy(desc(notifications.createdAt));

    const filtered = allNotifications.filter((n) => {
      if (filter === 'unread') return !n.isRead;
      if (filter === 'logs') return n.type === 'sms' || n.type === 'email';
      return true;
    });

    const unreadCount = allNotifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      notifications: filtered,
      allCount: allNotifications.length,
      unreadCount,
      // Legacy compatibility alias
      logs: allNotifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        recipient: n.recipient || '',
        timestamp: n.createdAt.toISOString(),
        isRead: n.isRead,
      })),
    });
  } catch (err: any) {
    console.error('[Notifications API] GET error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch notifications.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId: providedWorkspaceId, type, recipient, message, title, metadata } = body;

    if (!message) {
      return NextResponse.json({ error: 'Notification message is required.' }, { status: 400 });
    }

    const workspaceId = await getActiveWorkspaceId(providedWorkspaceId);

    const [newNotification] = await db
      .insert(notifications)
      .values({
        workspaceId,
        title: title || (type === 'sms' ? 'SMS Dispatched' : type === 'email' ? 'Email Sent' : 'System Alert'),
        message,
        type: type || 'system',
        recipient: recipient || null,
        metadata: metadata || null,
        isRead: false,
      })
      .returning();

    // Optionally dispatch multi-channel notification if recipient is given
    if (recipient && (type === 'sms' || type === 'email' || type === 'push')) {
      sendCustomNotification({
        workspaceId,
        type,
        recipient,
        message,
        title,
        data: metadata,
      }).catch((err) => console.warn('[Notifications API] Dispatch error:', err));
    }

    return NextResponse.json({
      success: true,
      notification: newNotification,
    });
  } catch (err: any) {
    console.error('[Notifications API] POST error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create notification.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId: providedWorkspaceId, id, all, isRead } = body;

    const workspaceId = await getActiveWorkspaceId(providedWorkspaceId);

    if (all === true) {
      // Mark all unread notifications as read for this workspace
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(and(eq(notifications.workspaceId, workspaceId), eq(notifications.isRead, false)));

      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (id) {
      // Mark specific notification
      const [updated] = await db
        .update(notifications)
        .set({ isRead: isRead !== undefined ? isRead : true })
        .where(and(eq(notifications.id, id), eq(notifications.workspaceId, workspaceId)))
        .returning();

      return NextResponse.json({ success: true, notification: updated });
    }

    return NextResponse.json({ error: 'Either notification ID or all: true is required.' }, { status: 400 });
  } catch (err: any) {
    console.error('[Notifications API] PATCH error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update notification.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const clearAllRead = searchParams.get('clearAllRead');
    const workspaceIdParam = searchParams.get('workspaceId');

    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    if (clearAllRead === 'true') {
      await db
        .delete(notifications)
        .where(and(eq(notifications.workspaceId, workspaceId), eq(notifications.isRead, true)));

      return NextResponse.json({ success: true, message: 'Cleared all read notifications.' });
    }

    if (id) {
      await db
        .delete(notifications)
        .where(and(eq(notifications.id, id as any), eq(notifications.workspaceId, workspaceId)));

      return NextResponse.json({ success: true, message: 'Notification deleted.' });
    }

    return NextResponse.json({ error: 'Notification ID or clearAllRead is required.' }, { status: 400 });
  } catch (err: any) {
    console.error('[Notifications API] DELETE error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete notification.' }, { status: 500 });
  }
}

