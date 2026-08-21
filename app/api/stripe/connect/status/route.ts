import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/stripe/connect/status - Fetch connected account status & payout readiness
export async function GET(req: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
    }

    if (!ws.stripeAccountId) {
      return NextResponse.json({
        connected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
        accountId: null,
      });
    }

    // In real Stripe environment, query live account status
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock') && !ws.stripeAccountId.startsWith('acct_simulated')) {
      try {
        const account = await stripe.accounts.retrieve(ws.stripeAccountId);
        const chargesEnabled = account.charges_enabled || false;
        const payoutsEnabled = account.payouts_enabled || false;
        const detailsSubmitted = account.details_submitted || false;

        // Sync with DB if changed
        if (
          ws.stripeChargesEnabled !== chargesEnabled ||
          ws.stripePayoutsEnabled !== payoutsEnabled ||
          ws.stripeDetailsSubmitted !== detailsSubmitted
        ) {
          await db.update(workspaces)
            .set({
              stripeChargesEnabled: chargesEnabled,
              stripePayoutsEnabled: payoutsEnabled,
              stripeDetailsSubmitted: detailsSubmitted,
            })
            .where(eq(workspaces.id, workspaceId));
        }

        return NextResponse.json({
          connected: true,
          chargesEnabled,
          payoutsEnabled,
          detailsSubmitted,
          accountId: account.id,
          email: account.email,
        });
      } catch (err: any) {
        console.warn('Could not retrieve Stripe account:', err?.message);
      }
    }

    // Return DB status or simulated active status in dev mode
    return NextResponse.json({
      connected: Boolean(ws.stripeAccountId),
      chargesEnabled: ws.stripeChargesEnabled || true,
      payoutsEnabled: ws.stripePayoutsEnabled || true,
      detailsSubmitted: ws.stripeDetailsSubmitted || true,
      accountId: ws.stripeAccountId,
      simulated: ws.stripeAccountId?.startsWith('acct_simulated'),
    });
  } catch (error: any) {
    console.error('Error fetching Stripe Connect status:', error);
    return NextResponse.json({ error: error.message || 'Status check failed.' }, { status: 500 });
  }
}
