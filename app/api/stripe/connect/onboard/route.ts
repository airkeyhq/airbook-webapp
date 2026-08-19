import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// POST /api/stripe/connect/onboard - Create Stripe Express Account & Onboarding Link
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }).catch(() => null);

    const userEmail = session?.user?.email || 'operator@airbook.app';

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const origin = `${protocol}://${host}`;

    // If real Stripe Key is present, create Express account & link
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: userEmail,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${origin}/dashboard?tab=settings`,
        return_url: `${origin}/dashboard?tab=pos&stripe_connected=true`,
        type: 'account_onboarding',
      });

      return NextResponse.json({ url: accountLink.url });
    }

    // Fallback simulation mode
    return NextResponse.json({
      url: `${origin}/dashboard?tab=pos&stripe_connected=true`,
      simulated: true,
      message: 'Stripe Connect Onboarding Simulated. Account linked successfully.',
    });
  } catch (error: any) {
    console.error('Error creating Stripe Connect onboarding link:', error);
    return NextResponse.json({ error: error.message || 'Stripe error' }, { status: 500 });
  }
}
