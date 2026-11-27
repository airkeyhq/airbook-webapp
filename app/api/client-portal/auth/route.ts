import { NextResponse } from 'next/server';
import { db } from '@/db';
import { verifications } from '@/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import { sendMagicLinkEmail } from '@/lib/notifications';
import { CLIENT_SESSION_COOKIE, signClientSession } from '@/lib/client-session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body?.action;
    const rawEmail = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!rawEmail || !rawEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const identifier = `client_otp:${rawEmail}`;

    if (action === 'request') {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      await db.delete(verifications).where(eq(verifications.identifier, identifier));
      await db.insert(verifications).values({
        id: `otp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        identifier,
        value: code,
        expiresAt,
      });

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com';
      const magicUrl = `${baseUrl}/book/portal?email=${encodeURIComponent(rawEmail)}&code=${code}`;
      await sendMagicLinkEmail({ email: rawEmail, url: magicUrl });

      return NextResponse.json({ success: true });
    }

    if (action === 'verify') {
      const code = typeof body?.code === 'string' ? body.code.trim() : '';
      if (code.length !== 6) {
        return NextResponse.json({ error: '6-digit code is required.' }, { status: 400 });
      }

      const [match] = await db
        .select()
        .from(verifications)
        .where(and(eq(verifications.identifier, identifier), eq(verifications.value, code), gt(verifications.expiresAt, new Date())))
        .limit(1);

      if (!match) {
        return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 401 });
      }

      await db.delete(verifications).where(eq(verifications.id, match.id));

      const token = signClientSession(rawEmail);
      const res = NextResponse.json({ success: true, email: rawEmail });
      res.cookies.set(CLIENT_SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
      return res;
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Client OTP error.' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(CLIENT_SESSION_COOKIE);
  return res;
}
