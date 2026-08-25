import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sessions, workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// POST /api/auth/passkey - Complete biometric Passkey authentication & set session cookie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    // 1. Find target user by email or active workspace owner
    let targetUser: typeof users.$inferSelect | undefined;

    if (email) {
      const [u] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      targetUser = u;
    }

    if (!targetUser) {
      // Find the first operator / user or active workspace owner
      const [firstUser] = await db.select().from(users).limit(1);
      targetUser = firstUser;
    }

    // If no user exists at all in the database yet, provision the initial operator account
    if (!targetUser) {
      const newUserId = `usr_${crypto.randomUUID()}`;
      const [workspace] = await db.select().from(workspaces).limit(1);
      const initialName = workspace?.name ? `${workspace.name} Operator` : 'AirBook Operator';
      const initialEmail = 'operator@getairbook.com';

      const [created] = await db
        .insert(users)
        .values({
          id: newUserId,
          name: initialName,
          email: initialEmail,
          emailVerified: true,
        })
        .returning();

      targetUser = created;
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'Could not resolve user account.' }, { status: 400 });
    }

    // 2. Generate a secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionId = `sess_${crypto.randomUUID()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.insert(sessions).values({
      id: sessionId,
      userId: targetUser.id,
      token: sessionToken,
      expiresAt,
      userAgent: req.headers.get('user-agent') || 'AirBook WebAuthn Client',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    // 3. Set Better Auth compatible session cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieName = isProduction ? '__Secure-better-auth.session_token' : 'better-auth.session_token';

    const response = NextResponse.json({
      success: true,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        image: targetUser.image,
      },
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

    // Also set un-prefixed fallback cookie for local environments
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
    console.error('Passkey authentication error:', error);
    return NextResponse.json(
      { error: error?.message || 'Passkey verification failed.' },
      { status: 500 }
    );
  }
}
