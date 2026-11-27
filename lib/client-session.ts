import crypto from 'crypto';

const COOKIE_NAME = 'airbook_client_session';

function getSecret(): string {
  return process.env.BETTER_AUTH_SECRET || process.env.CRON_SECRET || 'airbook-client-portal-dev-secret';
}

export function signClientSession(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      email: email.trim().toLowerCase(),
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyClientSession(token?: string | null): { email: string } | null {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;

  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed?.email || typeof parsed.exp !== 'number' || parsed.exp < Date.now()) {
      return null;
    }
    return { email: String(parsed.email) };
  } catch {
    return null;
  }
}

export { COOKIE_NAME as CLIENT_SESSION_COOKIE };
