import { createHash, randomBytes } from 'crypto';

/**
 * Generate a cryptographically random salt.
 */
export function generatePinSalt(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Hash a 4-to-6 digit supervisor/manager PIN with a salt using SHA-256.
 */
export function hashSupervisorPin(pin: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${pin.trim()}`).digest('hex');
}

/**
 * Verify a supervisor/manager PIN against stored hash and salt.
 */
export function verifySupervisorPin(pin: string, storedHash: string, salt: string): boolean {
  if (!pin || !storedHash || !salt) return false;
  const computedHash = hashSupervisorPin(pin, salt);
  return computedHash === storedHash;
}
