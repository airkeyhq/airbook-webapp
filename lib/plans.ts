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

export type CurrencyCode = 'USD' | 'MXN' | 'EUR' | 'GBP' | 'COP' | 'BRL' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flagCode: string;
  decimals: number;
  rates: {
    solo: { monthly: number; yearly: number };
    team: { monthly: number; yearly: number };
    scale: { monthly: number; yearly: number };
  };
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'USD ($)',
    flagCode: 'us',
    decimals: 0,
    rates: {
      solo: { monthly: 29, yearly: 24 },
      team: { monthly: 79, yearly: 64 },
      scale: { monthly: 199, yearly: 159 },
    },
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    label: 'MXN ($)',
    flagCode: 'mx',
    decimals: 0,
    rates: {
      solo: { monthly: 499, yearly: 399 },
      team: { monthly: 1399, yearly: 1099 },
      scale: { monthly: 3499, yearly: 2799 },
    },
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'EUR (€)',
    flagCode: 'eu',
    decimals: 0,
    rates: {
      solo: { monthly: 27, yearly: 22 },
      team: { monthly: 74, yearly: 59 },
      scale: { monthly: 185, yearly: 149 },
    },
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'GBP (£)',
    flagCode: 'gb',
    decimals: 0,
    rates: {
      solo: { monthly: 24, yearly: 19 },
      team: { monthly: 64, yearly: 52 },
      scale: { monthly: 159, yearly: 129 },
    },
  },
  COP: {
    code: 'COP',
    symbol: '$',
    label: 'COP ($)',
    flagCode: 'co',
    decimals: 0,
    rates: {
      solo: { monthly: 119000, yearly: 99000 },
      team: { monthly: 319000, yearly: 259000 },
      scale: { monthly: 799000, yearly: 649000 },
    },
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    label: 'BRL (R$)',
    flagCode: 'br',
    decimals: 0,
    rates: {
      solo: { monthly: 149, yearly: 119 },
      team: { monthly: 399, yearly: 319 },
      scale: { monthly: 999, yearly: 799 },
    },
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    label: 'CAD ($)',
    flagCode: 'ca',
    decimals: 0,
    rates: {
      solo: { monthly: 39, yearly: 32 },
      team: { monthly: 109, yearly: 89 },
      scale: { monthly: 269, yearly: 219 },
    },
  },
};

export const CURRENCIES_LIST = Object.values(SUPPORTED_CURRENCIES);

export const COUNTRY_TO_CURRENCY_MAP: Record<string, CurrencyCode> = {
  MX: 'MXN',
  ES: 'EUR',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  PT: 'EUR',
  AT: 'EUR',
  IE: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  GB: 'GBP',
  CO: 'COP',
  BR: 'BRL',
  CA: 'CAD',
  US: 'USD',
};

/**
 * Maps an ISO 2-letter country code to default currency.
 */
export function getCurrencyForCountry(countryCode?: string): CurrencyCode {
  if (!countryCode) return 'USD';
  const clean = countryCode.toUpperCase().trim();
  return COUNTRY_TO_CURRENCY_MAP[clean] || 'USD';
}

/**
 * Formats a localized price string.
 */
export function formatPlanPrice(
  amount: number,
  currencyCode: CurrencyCode = 'USD'
): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: config.decimals,
  }).format(amount);

  if (currencyCode === 'EUR') {
    return `${formattedNumber}€`;
  }
  if (currencyCode === 'GBP') {
    return `£${formattedNumber}`;
  }
  if (currencyCode === 'BRL') {
    return `R$${formattedNumber}`;
  }
  if (currencyCode === 'CAD') {
    return `CA$${formattedNumber}`;
  }
  return `$${formattedNumber}`;
}

/**
 * Retrieves localized monthly and yearly pricing for a given plan tier and currency.
 */
export function getPlanPricing(
  tier: PlanTier,
  currencyCode: CurrencyCode = 'USD'
): { monthly: number; yearly: number } {
  if (tier === 'free') return { monthly: 0, yearly: 0 };
  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const planRates = currency.rates[tier as 'solo' | 'team' | 'scale'];
  return planRates || { monthly: 0, yearly: 0 };
}

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
