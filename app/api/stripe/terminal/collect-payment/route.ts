import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

function getStripe() {
  const Stripe = require('stripe').default;
  return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2026-07-29.dahlia',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { amountCents, readerId, currency = 'usd', description, workspaceId } = await req.json();
    if (!amountCents || amountCents < 50) {
      return NextResponse.json({ error: 'Invalid amount. Minimum charge is $0.50.' }, { status: 400 });
    }
    if (!readerId) {
      return NextResponse.json({ error: 'readerId is required.' }, { status: 400 });
    }
    const wsId = await getActiveWorkspaceId(workspaceId);
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, wsId)).limit(1);

    if (!ws?.stripeAccountId) {
      return NextResponse.json({ error: 'Stripe Connect not configured.' }, { status: 400 });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(amountCents),
        currency,
        payment_method_types: ['card_present'],
        capture_method: 'manual',
        description: description || 'AirBook In-Person Payment',
      },
      { stripeAccount: ws.stripeAccountId }
    );

    await stripe.terminal.readers.processPaymentIntent(
      readerId,
      { payment_intent: paymentIntent.id },
      { stripeAccount: ws.stripeAccountId }
    );

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      readerId,
      status: 'collecting',
      message: `In-person payment of $${(amountCents / 100).toFixed(2)} is being collected on terminal reader.`,
    });
  } catch (err: any) {
    console.error('Terminal collect-payment error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to initiate terminal payment.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { paymentIntentId, workspaceId } = await req.json();
    const wsId = await getActiveWorkspaceId(workspaceId);
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, wsId)).limit(1);

    const stripe = getStripe();
    const captured = await stripe.paymentIntents.capture(
      paymentIntentId,
      {},
      { stripeAccount: ws?.stripeAccountId || undefined }
    );
    return NextResponse.json({ success: true, status: captured.status, paymentIntentId });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Capture failed.' }, { status: 500 });
  }
}
