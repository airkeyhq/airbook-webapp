import { createHmac } from 'crypto';

export type GeofenceRole = 'owner' | 'manager' | 'staff' | 'receptionist' | 'member';
export type GeofenceDeviceScope = 'all' | 'mobile_only';
export type GeofenceStrictness = 'strict' | 'warn_and_audit';

export interface GeofenceConfig {
  enabled: boolean;
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number;
  deviceScope: GeofenceDeviceScope;
  enforcedRoles: GeofenceRole[];
  exemptAdmins: boolean;
  sessionDurationHours: number;
  strictness: GeofenceStrictness;
  allowSupervisorBypass: boolean;
  trustedIps: string[];
}

export const DEFAULT_GEOFENCE_CONFIG: GeofenceConfig = {
  enabled: false,
  latitude: null,
  longitude: null,
  radiusMeters: 250,
  deviceScope: 'mobile_only',
  enforcedRoles: ['staff', 'receptionist', 'manager'],
  exemptAdmins: true,
  sessionDurationHours: 8,
  strictness: 'strict',
  allowSupervisorBypass: true,
  trustedIps: [],
};

/**
 * Resolves salon workspace geofence configuration with safe fallback defaults.
 */
export function resolveGeofenceConfig(workspaceGeofencing: unknown): GeofenceConfig {
  if (!workspaceGeofencing || typeof workspaceGeofencing !== 'object') {
    return { ...DEFAULT_GEOFENCE_CONFIG };
  }

  const raw = workspaceGeofencing as Partial<GeofenceConfig>;

  return {
    enabled: typeof raw.enabled === 'boolean' ? raw.enabled : DEFAULT_GEOFENCE_CONFIG.enabled,
    latitude: typeof raw.latitude === 'number' && !Number.isNaN(raw.latitude) ? raw.latitude : null,
    longitude: typeof raw.longitude === 'number' && !Number.isNaN(raw.longitude) ? raw.longitude : null,
    radiusMeters:
      typeof raw.radiusMeters === 'number' && raw.radiusMeters > 0
        ? raw.radiusMeters
        : DEFAULT_GEOFENCE_CONFIG.radiusMeters,
    deviceScope:
      raw.deviceScope === 'all' || raw.deviceScope === 'mobile_only'
        ? raw.deviceScope
        : DEFAULT_GEOFENCE_CONFIG.deviceScope,
    enforcedRoles:
      Array.isArray(raw.enforcedRoles) && raw.enforcedRoles.length > 0
        ? (raw.enforcedRoles.filter((r) =>
            ['owner', 'manager', 'staff', 'receptionist', 'member'].includes(r)
          ) as GeofenceRole[])
        : DEFAULT_GEOFENCE_CONFIG.enforcedRoles,
    exemptAdmins:
      typeof raw.exemptAdmins === 'boolean' ? raw.exemptAdmins : DEFAULT_GEOFENCE_CONFIG.exemptAdmins,
    sessionDurationHours:
      typeof raw.sessionDurationHours === 'number' && raw.sessionDurationHours > 0
        ? raw.sessionDurationHours
        : DEFAULT_GEOFENCE_CONFIG.sessionDurationHours,
    strictness:
      raw.strictness === 'warn_and_audit' || raw.strictness === 'strict'
        ? raw.strictness
        : DEFAULT_GEOFENCE_CONFIG.strictness,
    allowSupervisorBypass:
      typeof raw.allowSupervisorBypass === 'boolean'
        ? raw.allowSupervisorBypass
        : DEFAULT_GEOFENCE_CONFIG.allowSupervisorBypass,
    trustedIps: Array.isArray(raw.trustedIps)
      ? raw.trustedIps.filter((ip) => typeof ip === 'string' && ip.trim().length > 0)
      : [],
  };
}

/**
 * Calculates great-circle distance between two geographic coordinates using Haversine formula.
 * Returns distance in meters rounded to the nearest integer.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's mean radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Evaluates whether a coordinate point is within the salon's geofence.
 */
export function evaluateGeofence(
  userLat: number,
  userLon: number,
  config: GeofenceConfig
): {
  inside: boolean;
  distanceMeters: number | null;
  allowedRadiusMeters: number;
} {
  if (config.latitude === null || config.longitude === null) {
    // If coordinates are not yet configured, treat as inside to prevent locking out operators
    return {
      inside: true,
      distanceMeters: null,
      allowedRadiusMeters: config.radiusMeters,
    };
  }

  const distance = calculateDistanceMeters(userLat, userLon, config.latitude, config.longitude);

  return {
    inside: distance <= config.radiusMeters,
    distanceMeters: distance,
    allowedRadiusMeters: config.radiusMeters,
  };
}

/**
 * Checks whether a given User-Agent string is a mobile or tablet device.
 */
export function isMobileUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
}

/**
 * Checks if client IP matches any trusted IP or wildcard subnet.
 */
export function isIpTrusted(clientIp: string | null | undefined, trustedIps: string[]): boolean {
  if (!clientIp || !trustedIps || trustedIps.length === 0) return false;
  const cleanClient = clientIp.trim();
  return trustedIps.some((trusted) => {
    const cleanTrusted = trusted.trim();
    if (cleanTrusted === cleanClient) return true;
    // Prefix match if ending with wildcard, e.g. 192.168.1.*
    if (cleanTrusted.endsWith('*')) {
      return cleanClient.startsWith(cleanTrusted.slice(0, -1));
    }
    return false;
  });
}

/**
 * Session verification payload and signing for tamper-proof client cookies.
 */
export interface GeofenceSessionPayload {
  workspaceId: string;
  userId: string;
  role: string;
  verifiedAt: number;
  expiresAt: number;
  type: 'gps' | 'supervisor_bypass' | 'trusted_ip';
}

const GEOFENCE_COOKIE_SECRET =
  process.env.BETTER_AUTH_SECRET ||
  process.env.AUTH_SECRET ||
  'airbook-geofence-security-salt-2026';

export function signGeofencePayload(payload: GeofenceSessionPayload): string {
  const json = JSON.stringify(payload);
  const base64Payload = Buffer.from(json).toString('base64url');
  const hmac = createHmac('sha256', GEOFENCE_COOKIE_SECRET);
  hmac.update(base64Payload);
  const signature = hmac.digest('base64url');
  return `${base64Payload}.${signature}`;
}

export function verifyGeofenceToken(
  token: string | undefined | null,
  workspaceId: string,
  userId?: string | null
): GeofenceSessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [base64Payload, signature] = parts;
  const hmac = createHmac('sha256', GEOFENCE_COOKIE_SECRET);
  hmac.update(base64Payload);
  const expectedSignature = hmac.digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const json = Buffer.from(base64Payload, 'base64url').toString('utf8');
    const payload = JSON.parse(json) as GeofenceSessionPayload;

    if (payload.workspaceId !== workspaceId) return null;
    if (userId && payload.userId !== userId) return null;
    if (Date.now() > payload.expiresAt) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getGeofenceCookieName(workspaceId: string): string {
  return `airbook_geo_${workspaceId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32)}`;
}
