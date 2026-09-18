export type PlanTier = 'free' | 'solo' | 'team' | 'scale';

export type PlanFeature =
  | 'unlimited_bookings'
  | 'deposits_and_payouts'
  | 'client_notes'
  | 'multi_staff'
  | 'station_management'
  | 'inventory_management'
  | 'memberships_and_packages'
  | 'digital_waivers'
  | 'smart_rebooking'
  | 'multi_location'
  | 'custom_domain'
  | 'api_keys'
  | 'stripe_terminal'
  | 'compliance_audit';

export interface PlanLimits {
  maxStaff: number; // 1 for free/solo, 10 for team, Infinity for scale
  maxLocations: number; // 1 for free/solo/team, Infinity for scale
  smsCreditsPerMonth: number;
}

export interface PlanDefinition {
  id: PlanTier;
  name: string;
  badge: string;
  priceMonthly: number;
  priceYearly: number; // per month when billed yearly
  limits: PlanLimits;
  features: PlanFeature[];
}

export const AIRBOOK_PLAN_DEFINITIONS: Record<PlanTier, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Starter Solo',
    badge: 'Free Starter',
    priceMonthly: 0,
    priceYearly: 0,
    limits: {
      maxStaff: 1,
      maxLocations: 1,
      smsCreditsPerMonth: 25,
    },
    features: [
      'unlimited_bookings',
      'deposits_and_payouts',
      'client_notes',
    ],
  },
  solo: {
    id: 'solo',
    name: 'Solo Pro',
    badge: 'Solo Pro',
    priceMonthly: 29,
    priceYearly: 24,
    limits: {
      maxStaff: 1,
      maxLocations: 1,
      smsCreditsPerMonth: 100,
    },
    features: [
      'unlimited_bookings',
      'deposits_and_payouts',
      'client_notes',
    ],
  },
  team: {
    id: 'team',
    name: 'Team & Boutique',
    badge: 'Business Team',
    priceMonthly: 79,
    priceYearly: 64,
    limits: {
      maxStaff: 10,
      maxLocations: 1,
      smsCreditsPerMonth: 500,
    },
    features: [
      'unlimited_bookings',
      'deposits_and_payouts',
      'client_notes',
      'multi_staff',
      'station_management',
      'inventory_management',
      'memberships_and_packages',
      'digital_waivers',
      'smart_rebooking',
    ],
  },
  scale: {
    id: 'scale',
    name: 'Scale & Multi-Location',
    badge: 'Scale Enterprise',
    priceMonthly: 199,
    priceYearly: 159,
    limits: {
      maxStaff: Infinity,
      maxLocations: Infinity,
      smsCreditsPerMonth: 2500,
    },
    features: [
      'unlimited_bookings',
      'deposits_and_payouts',
      'client_notes',
      'multi_staff',
      'station_management',
      'inventory_management',
      'memberships_and_packages',
      'digital_waivers',
      'smart_rebooking',
      'multi_location',
      'custom_domain',
      'api_keys',
      'stripe_terminal',
      'compliance_audit',
    ],
  },
};

/**
 * Normalizes any plan string (e.g. 'pro', 'business', 'enterprise') to canonical PlanTier.
 */
export function normalizePlanTier(rawPlan?: string | null): PlanTier {
  if (!rawPlan) return 'free';
  const clean = rawPlan.toLowerCase().trim();
  if (clean === 'solo' || clean === 'pro' || clean === 'solo_pro' || clean === 'solo_pro_29') return 'solo';
  if (clean === 'team' || clean === 'business' || clean === 'boutique' || clean === 'team_79') return 'team';
  if (clean === 'scale' || clean === 'enterprise' || clean === 'scale_199') return 'scale';
  return 'free';
}

/**
 * Checks whether a given plan tier is entitled to use a specific feature.
 */
export function canAccessFeature(rawPlan: string | null | undefined, feature: PlanFeature): boolean {
  const tier = normalizePlanTier(rawPlan);
  const planDef = AIRBOOK_PLAN_DEFINITIONS[tier];
  return planDef.features.includes(feature);
}

/**
 * Returns the resource limits for a given plan tier.
 */
export function getPlanLimits(rawPlan: string | null | undefined): PlanLimits {
  const tier = normalizePlanTier(rawPlan);
  return AIRBOOK_PLAN_DEFINITIONS[tier].limits;
}

/**
 * Returns the minimum required tier for a given feature.
 */
export function getRequiredTierForFeature(feature: PlanFeature): PlanTier {
  if (AIRBOOK_PLAN_DEFINITIONS.solo.features.includes(feature)) return 'solo';
  if (AIRBOOK_PLAN_DEFINITIONS.team.features.includes(feature)) return 'team';
  return 'scale';
}
