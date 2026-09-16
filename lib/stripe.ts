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
