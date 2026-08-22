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
    const { workspaceId } = await req.json().catch(() => ({}));
    const wsId = await getActiveWorkspaceId(workspaceId);
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, wsId)).limit(1);

    if (!ws?.stripeAccountId) {
      return NextResponse.json({ error: 'Stripe Connect account not configured. Complete Stripe onboarding first.' }, { status: 400 });
    }

    const stripe = getStripe();
    let locationId = ws.stripeTerminalLocationId;
    if (!locationId) {
      const location = await stripe.terminal.locations.create(
        { display_name: ws.name, address: { country: 'US', line1: ws.address || '1 Airbook Blvd' } },
        { stripeAccount: ws.stripeAccountId }
      );
      locationId = location.id;
      await db.update(workspaces).set({ stripeTerminalLocationId: locationId }).where(eq(workspaces.id, wsId));
    }

    const connectionToken = await stripe.terminal.connectionTokens.create(
      {},
      { stripeAccount: ws.stripeAccountId }
    );

    return NextResponse.json({ success: true, secret: connectionToken.secret, locationId });
  } catch (err: any) {
    console.error('Terminal connection token error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create terminal connection token.' }, { status: 500 });
  }
}
