import { AIRBOOK_PLAN_DEFINITIONS, normalizePlanTier, canAccessFeature, getPlanLimits, getRequiredTierForFeature } from '../lib/plans.ts';

console.log('🧪 RUNNING AIRBOOK PAYWALL & FEATURE GATING QA SUITE...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Plan normalization
console.log('📦 1. Plan Normalization & Tier Resolution');
assert(normalizePlanTier('free') === 'free', 'normalizes free');
assert(normalizePlanTier('solo') === 'solo', 'normalizes solo');
assert(normalizePlanTier('solo_pro') === 'solo', 'normalizes solo_pro');
assert(normalizePlanTier('pro') === 'solo', 'normalizes pro to solo');
assert(normalizePlanTier('team') === 'team', 'normalizes team');
assert(normalizePlanTier('business') === 'team', 'normalizes business to team');
assert(normalizePlanTier('scale') === 'scale', 'normalizes scale');
assert(normalizePlanTier('enterprise') === 'scale', 'normalizes enterprise to scale');
assert(normalizePlanTier(null) === 'free', 'defaults null to free');
assert(normalizePlanTier(undefined) === 'free', 'defaults undefined to free');

// 2. Resource limits
console.log('\n📊 2. Resource Quotas & Limits Verification');
const freeLimits = getPlanLimits('free');
assert(freeLimits.maxStaff === 1, 'Free allows max 1 staff');
assert(freeLimits.maxLocations === 1, 'Free allows max 1 location');

const soloLimits = getPlanLimits('solo');
assert(soloLimits.maxStaff === 1, 'Solo Pro allows max 1 staff');
assert(soloLimits.maxLocations === 1, 'Solo Pro allows max 1 location');

const teamLimits = getPlanLimits('team');
assert(teamLimits.maxStaff === 10, 'Team allows max 10 staff');
assert(teamLimits.maxLocations === 1, 'Team allows max 1 location');

const scaleLimits = getPlanLimits('scale');
assert(scaleLimits.maxStaff === Infinity, 'Scale allows unlimited staff');
assert(scaleLimits.maxLocations === Infinity, 'Scale allows unlimited locations');

// 3. Feature Entitlements
console.log('\n🔒 3. Feature Entitlements & Paywall Gating Matrix');
// Custom domain
assert(!canAccessFeature('free', 'custom_domain'), 'Free cannot access custom_domain');
assert(!canAccessFeature('solo', 'custom_domain'), 'Solo cannot access custom_domain');
assert(!canAccessFeature('team', 'custom_domain'), 'Team cannot access custom_domain');
assert(canAccessFeature('scale', 'custom_domain'), 'Scale can access custom_domain');

// API Keys / MCP
assert(!canAccessFeature('free', 'api_keys'), 'Free cannot access api_keys');
assert(!canAccessFeature('solo', 'api_keys'), 'Solo cannot access api_keys');
assert(!canAccessFeature('team', 'api_keys'), 'Team cannot access api_keys');
assert(canAccessFeature('scale', 'api_keys'), 'Scale can access api_keys');

// Multi-Location
assert(!canAccessFeature('free', 'multi_location'), 'Free cannot access multi_location');
assert(!canAccessFeature('solo', 'multi_location'), 'Solo cannot access multi_location');
assert(!canAccessFeature('team', 'multi_location'), 'Team cannot access multi_location');
assert(canAccessFeature('scale', 'multi_location'), 'Scale can access multi_location');

// Inventory
assert(!canAccessFeature('free', 'inventory_management'), 'Free cannot access inventory_management');
assert(!canAccessFeature('solo', 'inventory_management'), 'Solo cannot access inventory_management');
assert(canAccessFeature('team', 'inventory_management'), 'Team can access inventory_management');
assert(canAccessFeature('scale', 'inventory_management'), 'Scale can access inventory_management');

// Bookings & Deposits (all tiers)
assert(canAccessFeature('free', 'unlimited_bookings'), 'Free has bookings');
assert(canAccessFeature('solo', 'unlimited_bookings'), 'Solo has bookings');
assert(canAccessFeature('team', 'unlimited_bookings'), 'Team has bookings');
assert(canAccessFeature('scale', 'unlimited_bookings'), 'Scale has bookings');

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
