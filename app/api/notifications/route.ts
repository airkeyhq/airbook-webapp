import { NextResponse } from 'next/server';
import { sendCustomNotification, getRecentNotificationLogs } from '@/lib/notifications';

export async function GET() {
  const logs = getRecentNotificationLogs();
  return NextResponse.json({ success: true, logs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, recipient, message, title } = body;

    if (!recipient || !message) {
      return NextResponse.json({ error: 'Recipient and message content are required.' }, { status: 400 });
    }

    const dispatchResult = await sendCustomNotification({
      type: (type as 'sms' | 'email' | 'push') || 'sms',
      recipient,
      message,
      title,
    });

    return NextResponse.json({
      success: true,
      log: dispatchResult.log,
      result: dispatchResult,
      provider: 'AirBook Multi-Channel Engine',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to dispatch notification.' }, { status: 500 });
  }
}

