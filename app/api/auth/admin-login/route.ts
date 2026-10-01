import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { isAdminEmail, getAdminUser } from '@/lib/admin';

// POST /api/auth/admin-login - Instant Executive & Admin 1-click Authentication
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify admin identity
    if (!isAdminEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Forbidden: This direct login endpoint is exclusively for authorized executive admins.' },
        { status: 403 }
      );
    }

    const adminProfile = getAdminUser(normalizedEmail);
    const adminName = adminProfile?.name || normalizedEmail.split('@')[0];

    // 1. Check or Provision user in database
    let [existingUser] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

    if (!existingUser) {
      const newUserId = `usr_${crypto.randomUUID()}`;
      const [created] = await db
        .insert(users)
        .values({
          id: newUserId,
          name: adminName,
          email: normalizedEmail,
          emailVerified: true,
        })
        .returning();
      existingUser = created;
    } else {
      // Ensure emailVerified is true and name is up-to-date
      if (!existingUser.emailVerified || existingUser.name !== adminName) {
        const [updated] = await db
          .update(users)
          .set({ emailVerified: true, name: adminName, updatedAt: new Date() })
          .where(eq(users.id, existingUser.id))
          .returning();
        existingUser = updated;
      }
    }

    if (!existingUser) {
      return NextResponse.json({ error: 'Failed to provision admin user account.' }, { status: 500 });
    }

    // 2. Generate active 30-day session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionId = `sess_${crypto.randomUUID()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      id: sessionId,
      userId: existingUser.id,
      token: sessionToken,
      expiresAt,
      userAgent: req.headers.get('user-agent') || 'AirBook Executive Client',
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
    });

    // 3. Set Better Auth cookies
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieName = isProduction ? '__Secure-better-auth.session_token' : 'better-auth.session_token';

    const response = NextResponse.json({
      success: true,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: adminProfile?.role || 'admin',
        title: adminProfile?.title || 'Platform Admin',
      },
      redirect: '/in',
      sessionToken,
    });

    response.cookies.set({
      name: cookieName,
      value: sessionToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    if (isProduction) {
      response.cookies.set({
        name: 'better-auth.session_token',
        value: sessionToken,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Admin direct login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Admin authentication failed.' },
      { status: 500 }
    );
  }
}
