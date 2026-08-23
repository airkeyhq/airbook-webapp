import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { headers } from 'next/headers';

// POST /api/stripe/connect/onboard - Create Stripe Express Account & Onboarding Link
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }).catch(() => null);

    const userEmail = session?.user?.email || 'operator@getairbook.com';
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const origin = `${protocol}://${host}`;

    const workspaceId = await getActiveWorkspaceId();
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1);

    // If real Stripe Key is present, create or resume Express account
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
      let accountId = ws?.stripeAccountId;

      if (!accountId) {
        const account = await stripe.accounts.create({
          type: 'express',
          country: 'US',
          email: userEmail,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_profile: {
            name: ws?.name || 'AirBook Salon',
            url: `https://getairbook.com/book/${ws?.slug || 'salon'}`,
          },
        });
        accountId = account.id;

        await db.update(workspaces)
          .set({ stripeAccountId: accountId })
          .where(eq(workspaces.id, workspaceId));
      }

      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${origin}/dashboard?tab=settings`,
        return_url: `${origin}/dashboard?tab=onlineBooking&stripe_connected=true`,
        type: 'account_onboarding',
      });

      return NextResponse.json({ url: accountLink.url, accountId, success: true });
    }

    // In dev / simulation mode, mark workspace with simulated connected account
    await db.update(workspaces)
      .set({
        stripeAccountId: ws?.stripeAccountId || 'acct_simulated_demo',
        stripeChargesEnabled: true,
        stripePayoutsEnabled: true,
        stripeDetailsSubmitted: true,
      })
      .where(eq(workspaces.id, workspaceId));

    return NextResponse.json({
      url: `${origin}/dashboard?tab=onlineBooking&stripe_connected=true`,
      simulated: true,
      success: true,
      message: 'Stripe Connect Express Account linked successfully (Simulated Payouts Active).',
    });
  } catch (error: any) {
    console.error('Error creating Stripe Connect onboarding link:', error);
    return NextResponse.json({ error: error.message || 'Stripe error' }, { status: 500 });
  }
}
