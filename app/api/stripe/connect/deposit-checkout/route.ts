import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/stripe/connect/deposit-checkout - Create checkout session for upfront booking deposit
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      appointmentId,
      groupId,
      depositCents,
      totalDueCents,
      serviceName,
      clientName,
      clientEmail,
      dateStr,
      startTime,
      slug,
    } = body;

    if (!depositCents || depositCents <= 0) {
      return NextResponse.json({ error: 'Valid deposit amount required.' }, { status: 400 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const origin = `${protocol}://${host}`;

    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
    }

    const bookingSlug = slug || ws.slug || 'my-salon';
    const bookingRef = groupId || appointmentId || `BK-${Date.now().toString(36).toUpperCase()}`;

    // Real Stripe Environment with Connected Express Account
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock') && ws.stripeAccountId && !ws.stripeAccountId.startsWith('acct_simulated')) {
      const platformFee = Math.round(depositCents * 0.03); // 3% Platform booking fee

      const sessionParams: any = {
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: clientEmail || undefined,
        line_items: [
          {
            price_data: {
              currency: (ws.currency || 'USD').toLowerCase(),
              product_data: {
                name: `${serviceName || 'Salon Service'} · Deposit`,
                description: `Appointment at ${ws.name} on ${dateStr} at ${startTime}`,
              },
              unit_amount: depositCents,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: platformFee,
          transfer_data: {
            destination: ws.stripeAccountId,
          },
          metadata: {
            workspaceId,
            appointmentId: appointmentId || '',
            groupId: groupId || '',
            clientEmail: clientEmail || '',
            bookingSlug,
          },
        },
        metadata: {
          workspaceId,
          appointmentId: appointmentId || '',
          groupId: groupId || '',
          bookingSlug,
        },
        success_url: `${origin}/book/${bookingSlug}?booking=success&ref=${bookingRef}&paid=true`,
        cancel_url: `${origin}/book/${bookingSlug}?booking=cancelled`,
      };

      const checkoutSession = await stripe.checkout.sessions.create(sessionParams);
      return NextResponse.json({ url: checkoutSession.url, success: true });
    }

    // Dev / Test Simulation
    return NextResponse.json({
      url: `${origin}/book/${bookingSlug}?booking=success&ref=${bookingRef}&paid=true&simulated=true`,
      simulated: true,
      success: true,
    });
  } catch (error: any) {
    console.error('Error creating deposit checkout session:', error);
    return NextResponse.json({ error: error.message || 'Deposit checkout failed.' }, { status: 500 });
  }
}
