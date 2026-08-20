import Stripe from 'stripe';

export const isStripeConfigured = Boolean(
  process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')
);

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_secret_key_2026', {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
});

export const AIRBOOK_PLANS = {
  pro: {
    name: 'Pro',
    priceMonthly: 20,
    priceYearly: 16,
    features: [
      'Unlimited bookings per month',
      'Bot-free appointment scheduling',
      'AI Notes & Client Preferences',
      'Upload client photos & intake forms',
      'Automated SMS & Email Reminders',
    ],
  },
  business: {
    name: 'Business',
    priceMonthly: 40,
    priceYearly: 32,
    features: [
      'Everything in Pro, plus:',
      'Custom branding on shared booking pages',
      'Staff chair commission splitting',
      'Multi-location support',
      'Advanced POS & Deposit payouts',
    ],
  },
};
