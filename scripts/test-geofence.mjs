import assert from 'node:assert/strict';
import {
  calculateDistanceMeters,
  evaluateGeofence,
  isMobileUserAgent,
  isIpTrusted,
  signGeofencePayload,
  verifyGeofenceToken,
  DEFAULT_GEOFENCE_CONFIG,
} from '../lib/geofence.ts';
import {
  generatePinSalt,
  hashSupervisorPin,
  verifySupervisorPin,
} from '../lib/supervisor-pin.ts';

console.log('Testing Geofencing Math & Security Suite for AirBook...');

// 1. Distance Calculation (Haversine Formula)
// Known points:
// Salon Point A: 25.7617, -80.1918 (Downtown Miami)
// Client Point B: 25.7617, -80.1908 (~100 meters east)
const dist1 = calculateDistanceMeters(25.7617, -80.1918, 25.7617, -80.1908);
assert(dist1 > 90 && dist1 < 110, `Expected ~100m, got ${dist1}`);
console.log(`✅ Haversine distance calculation: ${dist1}m (Within expected 90-110m range)`);

// Same point should be 0 meters
const distZero = calculateDistanceMeters(40.7128, -74.006, 40.7128, -74.006);
assert.equal(distZero, 0, 'Same coordinates must yield 0 meters');
console.log('✅ Same point distance is 0m');

// 2. Evaluation inside vs outside
const testConfig = {
  ...DEFAULT_GEOFENCE_CONFIG,
  enabled: true,
  latitude: 25.7617,
  longitude: -80.1918,
  radiusMeters: 150,
};

const insideEval = evaluateGeofence(25.7617, -80.1908, testConfig);
assert.equal(insideEval.inside, true, 'Point within 100m must be inside 150m perimeter');
console.log('✅ Inside evaluation verified');

// Point ~1km away
const outsideEval = evaluateGeofence(25.7700, -80.1918, testConfig);
assert.equal(outsideEval.inside, false, 'Point 1km away must be outside 150m perimeter');
assert(outsideEval.distanceMeters > 800, 'Distance must be > 800m');
console.log(`✅ Outside evaluation verified (${outsideEval.distanceMeters}m away)`);

// 3. User Agent detection
assert.equal(
  isMobileUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15'),
  true,
  'iPhone must be identified as mobile'
);
assert.equal(
  isMobileUserAgent('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile Safari/537.36'),
  true,
  'Android must be identified as mobile'
);
assert.equal(
  isMobileUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36'),
  false,
  'Mac desktop browser must not be identified as mobile'
);
console.log('✅ Mobile User-Agent classification verified');

// 4. IP Whitelist Matching
const trustedIps = ['192.168.1.*', '73.189.44.12'];
assert.equal(isIpTrusted('192.168.1.45', trustedIps), true, 'Subnet wildcard match must pass');
assert.equal(isIpTrusted('73.189.44.12', trustedIps), true, 'Exact IP match must pass');
assert.equal(isIpTrusted('10.0.0.1', trustedIps), false, 'Unknown IP must fail');
console.log('✅ Trusted Wi-Fi and IP whitelist verification passed');

// 5. Tamper-Proof Cryptographic Session Token (HMAC-SHA256)
const samplePayload = {
  workspaceId: 'ws_salon_aurelia_123',
  userId: 'usr_specialist_456',
  role: 'staff',
  verifiedAt: Date.now(),
  expiresAt: Date.now() + 8 * 3600 * 1000,
  type: 'gps',
};

const token = signGeofencePayload(samplePayload);
assert(typeof token === 'string' && token.includes('.'), 'Token must be signature-delimited');

const verified = verifyGeofenceToken(token, 'ws_salon_aurelia_123', 'usr_specialist_456');
assert(verified !== null, 'Valid token must verify successfully');
assert.equal(verified.workspaceId, 'ws_salon_aurelia_123');
assert.equal(verified.role, 'staff');

// Tampered token test
const tamperedToken = token.slice(0, -4) + 'abcd';
const failedVerify = verifyGeofenceToken(tamperedToken, 'ws_salon_aurelia_123');
assert.equal(failedVerify, null, 'Tampered signature must be rejected');
console.log('✅ Cryptographic HMAC token signing & tamper resistance verified');

// 6. Supervisor PIN Hashing & Verification
const salt = generatePinSalt();
const pin = '8492';
const hash = hashSupervisorPin(pin, salt);
assert.equal(verifySupervisorPin(pin, hash, salt), true, 'Correct PIN must verify');
assert.equal(verifySupervisorPin('9999', hash, salt), false, 'Wrong PIN must be rejected');
assert.equal(verifySupervisorPin('', hash, salt), false, 'Empty PIN must be rejected');
console.log('✅ Supervisor emergency override PIN cryptographic hashing passed');

console.log('\n🎉 ALL GEOFENCING SECURITY TESTS PASSED SUCCESSFULLY!');
