import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendBookingNotifications } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, plan, clientName, clientEmail, serviceName, staffName, dateStr, startTime, amountCents } = body;

    // Trigger Novu Booking Notification
    if (clientEmail) {
      await sendBookingNotifications({
        subscriberId: `sub-${Date.now()}`,
        clientName: clientName || 'Client',
        clientEmail: clientEmail,
        serviceName: serviceName || 'Booking',
        staffName: staffName || 'Specialist',
        dateStr: dateStr || 'Today',
        startTime: startTime || '14:00',
        price: (amountCents || 2000) / 100,
      });
    }

    if (type === 'subscription') {
      // Mock Stripe Checkout Session for Pro / Business SaaS Tier
      return NextResponse.json({
        url: `https://checkout.stripe.com/pay/mock_airbook_${plan}_session`,
        success: true,
      });
    }

    // Upfront Booking Deposit Payment
    return NextResponse.json({
      url: `https://checkout.stripe.com/pay/mock_airbook_deposit_session`,
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Payment initiation failed' }, { status: 500 });
  }
}
