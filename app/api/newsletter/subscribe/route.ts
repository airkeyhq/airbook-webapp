import { NextResponse } from 'next/server';
import { db } from '@/db';
import { newsletterSubscribers, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, locale = 'en', source = 'marketing_footer', _airbook_hp_check } = body;

    // Anti-bot Honeypot Trap
    if (_airbook_hp_check) {
      console.warn('[Security] Bot newsletter submission blocked via honeypot trap.');
      return NextResponse.json({ error: 'Automated submission rejected.' }, { status: 403 });
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    // 1. Check if the subscriber has an active logged-in session
    let matchedUserId: string | null = null;
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user?.id) {
        matchedUserId = session.user.id;
      }
    } catch {
      // Session check optional for public guests
    }

    // 2. If no active session, check if email matches an existing registered user
    if (!matchedUserId) {
      try {
        const [existingUser] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, normalizedEmail))
          .limit(1);

        if (existingUser?.id) {
          matchedUserId = existingUser.id;
        }
      } catch (err) {
        console.warn('User match lookup warning:', err);
      }
    }

    // 3. Upsert into newsletterSubscribers table
    try {
      await db
        .insert(newsletterSubscribers)
        .values({
          email: normalizedEmail,
          userId: matchedUserId,
          locale: typeof locale === 'string' ? locale.substring(0, 10) : 'en',
          source: typeof source === 'string' ? source.substring(0, 50) : 'marketing_footer',
          status: 'active',
        })
        .onConflictDoUpdate({
          target: newsletterSubscribers.email,
          set: {
            locale: typeof locale === 'string' ? locale.substring(0, 10) : 'en',
            source: typeof source === 'string' ? source.substring(0, 50) : 'marketing_footer',
            status: 'active',
            updatedAt: new Date(),
            ...(matchedUserId ? { userId: matchedUserId } : {}),
          },
        });
    } catch (dbErr) {
      console.error('Database newsletter insert error:', dbErr);
      // Even if DB error, respond gracefully to user
    }

    return NextResponse.json({
      success: true,
      isRegisteredUser: !!matchedUserId,
      email: normalizedEmail,
    });
  } catch (err: any) {
    console.error('Newsletter subscribe error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to subscribe.' }, { status: 500 });
  }
}
