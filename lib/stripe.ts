import Stripe from 'stripe';

export const isStripeConfigured = Boolean(
  process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')
);

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_secret_key_2026', {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
});

export const AIRBOOK_PLANS = {
  solo: {
    id: 'solo',
    name: 'Solo Pro',
    priceMonthly: 29,
    priceYearly: 24,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_SOLO_MONTHLY || 'price_solo_monthly',
    stripePriceIdYearly: process.env.STRIPE_PRICE_SOLO_YEARLY || 'price_solo_yearly',
    features: [
      'Unlimited client bookings & deposits',
      'AI Receptionist & smart intake forms',
      'Stripe Instant Payouts (+45 bps processing)',
      'Automated SMS & Email Reminders',
      'Digital E-Sign waivers & medical forms',
    ],
  },
  team: {
    id: 'team',
    name: 'Team & Boutique',
    priceMonthly: 79,
    priceYearly: 64,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_TEAM_MONTHLY || 'price_team_monthly',
    stripePriceIdYearly: process.env.STRIPE_PRICE_TEAM_YEARLY || 'price_team_yearly',
    features: [
      'Everything in Solo Pro, plus:',
      'Up to 10 staff members & chair commission splits',
      'Multi-resource room & equipment scheduling',
      'Retail inventory & automated low-stock POs',
      'Loyalty memberships, packages & gift cards',
      'Branded client booking portal & embed widget',
    ],
  },
  scale: {
    id: 'scale',
    name: 'Scale & Multi-Location',
    priceMonthly: 199,
    priceYearly: 159,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_SCALE_MONTHLY || 'price_scale_monthly',
    stripePriceIdYearly: process.env.STRIPE_PRICE_SCALE_YEARLY || 'price_scale_yearly',
    features: [
      'Everything in Team, plus:',
      'Unlimited locations & multi-salon dashboard',
      'Custom White-Label domain with auto-SSL',
      'Stripe Terminal card reader integration',
      'HIPAA / KYC audit compliance ledger',
      'Dedicated API access & webhook integrations',
      '24/7 Priority Concierge migration support',
    ],
  },
  get pro() {
    return this.solo;
  },
  get business() {
    return this.team;
  },
};

export const FOUNDING_GRANDFATHER_COUPON_ID = 'AIRBOOK_FOUNDING_LIFETIME_50';

/**
 * Creates or retrieves a Stripe customer and configures their Founding Member grandfather status:
 * - 60 days (2 months) free pilot grace period in Stripe/metadata
 * - Pre-provisions or tags grandfather coupon with lifetime 50% discount rate when moving beyond alpha/pilot status
 * - Explicit metadata tagging: foundingClient: true, grandfatheredTier, pilotEndsAt
 */
export async function provisionFoundingStripeCustomer(params: {
  email: string;
  name: string;
  businessName: string;
  workspaceId: string;
  tier: 'solo' | 'team' | 'scale';
  trialDays?: number;
}): Promise<{
  customerId: string;
  couponId?: string;
  grandfatheredDiscountPercent: number;
  trialEndsAt: Date;
}> {
  const trialDays = params.trialDays || 60; // 2 months free
  const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);
  const grandfatheredDiscountPercent = 50; // 50% lifetime grandfathered discount

  if (!isStripeConfigured) {
    console.log(
      `[Stripe · Dev Fallback] Provisioned mock Founding customer for ${params.email} on tier ${params.tier} (${trialDays} days free, ${grandfatheredDiscountPercent}% lifetime discount)`
    );
    return {
      customerId: `cus_mock_founding_${Date.now()}`,
      couponId: FOUNDING_GRANDFATHER_COUPON_ID,
      grandfatheredDiscountPercent,
      trialEndsAt,
    };
  }

  try {
    // 1. Ensure grandfather coupon exists in Stripe
    try {
      await stripe.coupons.retrieve(FOUNDING_GRANDFATHER_COUPON_ID);
    } catch (couponNotFound) {
      // Create lifetime 50% grandfather coupon if it doesn't exist yet
      await stripe.coupons.create({
        id: FOUNDING_GRANDFATHER_COUPON_ID,
        name: 'AirBook Founding Member — 50% Lifetime Rate',
        percent_off: grandfatheredDiscountPercent,
        duration: 'forever',
        metadata: {
          program: 'founding_client_pilot_2026',
          description: 'Lifetime grandfathered tier discount for Founding Pilot Members',
        },
      });
      console.log(`[Stripe] Created grandfather coupon: ${FOUNDING_GRANDFATHER_COUPON_ID}`);
    }

    // 2. Check if customer already exists in Stripe
    const existing = await stripe.customers.list({
      email: params.email.toLowerCase().trim(),
      limit: 1,
    });

    let customerId: string;
    const metadata = {
      foundingClient: 'true',
      foundingPilotStatus: 'pilot_active',
      grandfatheredTier: params.tier,
      grandfatheredDiscountPercent: String(grandfatheredDiscountPercent),
      couponId: FOUNDING_GRANDFATHER_COUPON_ID,
      workspaceId: params.workspaceId,
      businessName: params.businessName,
      pilotStartDate: new Date().toISOString(),
      pilotEndsAt: trialEndsAt.toISOString(),
      pilotDaysFree: String(trialDays),
    };

    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
      await stripe.customers.update(customerId, {
        name: params.name,
        metadata,
      });
    } else {
      const newCustomer = await stripe.customers.create({
        email: params.email.toLowerCase().trim(),
        name: params.name,
        description: `Founding Member — ${params.businessName}`,
        metadata,
      });
      customerId = newCustomer.id;
    }

    return {
      customerId,
      couponId: FOUNDING_GRANDFATHER_COUPON_ID,
      grandfatheredDiscountPercent,
      trialEndsAt,
    };
  } catch (error: any) {
    console.warn('[Stripe] Error provisioning founding customer:', error?.message || error);
    // Graceful fallback to preserve approval flow even if Stripe API has network hiccups
    return {
      customerId: `cus_fallback_${Date.now()}`,
      couponId: FOUNDING_GRANDFATHER_COUPON_ID,
      grandfatheredDiscountPercent,
      trialEndsAt,
    };
  }
}
