import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured, AIRBOOK_PLANS } from '@/lib/stripe';
import { sendBookingNotifications } from '@/lib/notifications';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type, plan, billingCycle, workspaceId,
      clientName, clientEmail, serviceName, staffName, dateStr, startTime,
      amountCents, appointmentId,
    } = body;

    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable checkout.' },
        { status: 503 }
      );
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const origin = `${protocol}://${host}`;
    const activeWorkspaceId = await getActiveWorkspaceId(workspaceId);

    if (type === 'subscription') {
      const planKey = plan as 'pro' | 'business';
      const planConfig = AIRBOOK_PLANS[planKey];
      if (!planConfig) {
        return NextResponse.json({ error: 'Unknown plan selected.' }, { status: 400 });
      }
      const cycle = billingCycle === 'monthly' ? 'monthly' : 'yearly';
      const unitAmount = Math.round(
        (cycle === 'monthly' ? planConfig.priceMonthly : planConfig.priceYearly) * 100
      );

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: `AirBook ${planConfig.name} (${cycle})` },
              unit_amount: unitAmount,
              recurring: { interval: cycle === 'monthly' ? 'month' : 'year' },
            },
            quantity: 1,
          },
        ],
        subscription_data: { trial_period_days: 7 },
        success_url: `${origin}/dashboard?tab=settings&subscription=success`,
        cancel_url: `${origin}/dashboard?tab=settings&subscription=cancelled`,
        metadata: { workspaceId: activeWorkspaceId, plan: planKey, billingCycle: cycle },
      });

      return NextResponse.json({ url: checkoutSession.url, success: true });
    }

    // Upfront booking deposit payment
    if (clientEmail) {
      await sendBookingNotifications({
        subscriberId: `sub-${Date.now()}`,
        clientName: clientName || 'Client',
        clientEmail,
        serviceName: serviceName || 'Booking',
        staffName: staffName || 'Specialist',
        dateStr: dateStr || 'Today',
        startTime: startTime || '14:00',
        price: (amountCents || 2000) / 100,
      });
    }

    const depositSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Deposit — ${serviceName || 'Appointment'}` },
            unit_amount: amountCents || 2000,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?tab=calendar&deposit=success`,
      cancel_url: `${origin}/dashboard?tab=calendar&deposit=cancelled`,
      metadata: { workspaceId: activeWorkspaceId, appointmentId: appointmentId || '' },
    });

    return NextResponse.json({ url: depositSession.url, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Payment initiation failed' }, { status: 500 });
  }
}
