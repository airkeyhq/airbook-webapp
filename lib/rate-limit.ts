import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting by key (IP or identifier)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Extracts the most reliable client IP address from request headers.
 */
export function getClientIp(req: Request | NextRequest): string {
  const headers = req.headers;
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp && firstIp !== '::1' && firstIp !== '127.0.0.1') {
      return firstIp;
    }
  }

  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const vercelIp = headers.get('x-vercel-ip-country') ? 'vercel-client' : null;
  if (vercelIp) return vercelIp;

  return '127.0.0.1';
}

export interface RateLimitOptions {
  /** Maximum allowed requests within the window. */
  limit: number;
  /** Window duration in seconds. */
  windowSeconds: number;
  /** Prefix for key separation (e.g. 'booking', 'newsletter', 'mcp') */
  prefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and increments rate limit for a given request or identifier.
 */
export function checkRateLimit(
  reqOrIdentifier: Request | NextRequest | string,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowSeconds, prefix = 'global' } = options;
  const identifier =
    typeof reqOrIdentifier === 'string'
      ? reqOrIdentifier
      : getClientIp(reqOrIdentifier);

  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    // New or expired window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetSeconds: windowSeconds,
    };
  }

  // Existing window
  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  const resetSeconds = Math.ceil((existing.resetAt - now) / 1000);
  const allowed = existing.count <= limit;

  return {
    allowed,
    limit,
    remaining,
    resetSeconds,
  };
}

/**
 * Helper to return a standard 429 Too Many Requests response with security headers.
 */
export function rateLimitExceededResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests. Please slow down and try again shortly.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfterSeconds: result.resetSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.resetSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
      },
    }
  );
}
