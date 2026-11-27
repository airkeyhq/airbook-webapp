import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientEmail, clientName, workspaceId } = body || {};

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: 'Stripe not configured; card-on-file skipped in dev mode.',
      });
    }

    const stripe = new Stripe(secretKey);
    const customer = await stripe.customers.create({
      email: clientEmail || undefined,
      name: clientName || undefined,
      metadata: { workspaceId: workspaceId || '' },
    });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: 'off_session',
      payment_method_types: ['card'],
    });

    return NextResponse.json({
      success: true,
      customerId: customer.id,
      setupIntentId: setupIntent.id,
      clientSecret: setupIntent.client_secret,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create SetupIntent.' }, { status: 500 });
  }
}
