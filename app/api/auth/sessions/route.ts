import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions, users } from '@/db/schema';
import { eq, and, not, desc } from 'drizzle-orm';
import { parseUserAgent } from '@/lib/user-agent';

// GET /api/auth/sessions - List active login sessions for the current operator/user
export async function GET(req: NextRequest) {
  try {
    const currentToken =
      req.cookies.get('__Secure-better-auth.session_token')?.value ||
      req.cookies.get('better-auth.session_token')?.value;

    let targetUserId: string | null = null;

    if (currentToken) {
      const [currentSession] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.token, currentToken))
        .limit(1);

      if (currentSession) {
        targetUserId = currentSession.userId;
      }
    }

    if (!targetUserId) {
      // Fallback to first user in workspace
      const [firstUser] = await db.select().from(users).limit(1);
      if (firstUser) {
        targetUserId = firstUser.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ sessions: [] });
    }

    const userSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, targetUserId))
      .orderBy(desc(sessions.createdAt));

    // If no sessions in DB yet, create a synthetic entry for the current live device
    if (userSessions.length === 0) {
      const ua = req.headers.get('user-agent') || '';
      return NextResponse.json({
        sessions: [
          {
            id: 'current-session',
            device: parseUserAgent(ua),
            ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
            createdAt: new Date().toISOString(),
            isCurrent: true,
          },
        ],
      });
    }

    const formatted = userSessions.map((s, idx) => ({
      id: s.id,
      device: parseUserAgent(s.userAgent),
      ipAddress: s.ipAddress || '127.0.0.1',
      createdAt: s.createdAt,
      isCurrent: currentToken ? s.token === currentToken : idx === 0,
    }));

    return NextResponse.json({ sessions: formatted });
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch sessions.' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth/sessions - Revoke a specific session or all other sessions
export async function DELETE(req: NextRequest) {
  try {
    const currentToken =
      req.cookies.get('__Secure-better-auth.session_token')?.value ||
      req.cookies.get('better-auth.session_token')?.value;

    const body = await req.json().catch(() => ({}));
    const { sessionId, revokeOthers } = body;

    let targetUserId: string | null = null;

    if (currentToken) {
      const [currentSession] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.token, currentToken))
        .limit(1);

      if (currentSession) {
        targetUserId = currentSession.userId;
      }
    }

    if (!targetUserId) {
      const [firstUser] = await db.select().from(users).limit(1);
      if (firstUser) {
        targetUserId = firstUser.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (revokeOthers && currentToken) {
      // Revoke all sessions except current one
      await db
        .delete(sessions)
        .where(
          and(
            eq(sessions.userId, targetUserId),
            not(eq(sessions.token, currentToken))
          )
        );
      return NextResponse.json({ success: true, revokedAllOthers: true });
    } else if (sessionId) {
      // Revoke specific session
      await db
        .delete(sessions)
        .where(
          and(
            eq(sessions.userId, targetUserId),
            eq(sessions.id, sessionId)
          )
        );
      return NextResponse.json({ success: true, revokedId: sessionId });
    }

    return NextResponse.json({ error: 'Invalid revoke request' }, { status: 400 });
  } catch (error: any) {
    console.error('Error revoking session:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to revoke session.' },
      { status: 500 }
    );
  }
}
