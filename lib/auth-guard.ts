import { NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { members, workspaces, sessions, users } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { isAdminEmail, getAdminUser, AdminUser } from '@/lib/admin';

export interface AuthSessionResult {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
}

/**
 * Validates the caller's session from request headers.
 * Returns the session and user if valid, or null if unauthenticated.
 */
export async function getAuthSession(): Promise<AuthSessionResult | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.id) {
      return session as AuthSessionResult;
    }
  } catch (err) {
    console.warn('[AuthGuard] Failed to resolve session via BetterAuth:', err);
  }

  // Fallback: Check direct database session via cookie session token
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('__Secure-better-auth.session_token')?.value ||
      cookieStore.get('better-auth.session_token')?.value;

    if (token) {
      const [dbSession] = await db
        .select()
        .from(sessions)
        .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
        .limit(1);

      if (dbSession) {
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, dbSession.userId))
          .limit(1);

        if (dbUser) {
          return {
            user: {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              image: dbUser.image,
            },
            session: {
              id: dbSession.id,
              userId: dbSession.userId,
              token: dbSession.token,
              expiresAt: dbSession.expiresAt,
            },
          };
        }
      }
    }
  } catch (dbErr) {
    console.warn('[AuthGuard] Direct DB session lookup failed:', dbErr);
  }

  return null;
}

/**
 * Enforces an active authenticated session for an API route.
 * Returns { user, session } if authenticated, or a 401 NextResponse ready to return.
 */
export async function requireAuthSession(): Promise<
  | { authenticated: true; user: AuthSessionResult['user']; session: AuthSessionResult['session'] }
  | { authenticated: false; response: NextResponse }
> {
  const authSession = await getAuthSession();

  if (!authSession) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          error: 'Unauthorized: Active session required to perform this action.',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      ),
    };
  }

  return {
    authenticated: true,
    user: authSession.user,
    session: authSession.session,
  };
}

/**
 * Enforces that the caller is an authenticated AirBook administrator (e.g. Eduardo Gonzalez CEO or Raul Admin).
 * Returns { authenticated: true, user, session, adminProfile } or appropriate 401/403 NextResponse.
 */
export async function requireAdminSession(): Promise<
  | {
      authenticated: true;
      user: AuthSessionResult['user'];
      session: AuthSessionResult['session'];
      adminProfile: AdminUser;
    }
  | { authenticated: false; response: NextResponse }
> {
  const authCheck = await requireAuthSession();
  if (!authCheck.authenticated) {
    return authCheck;
  }

  const email = authCheck.user.email;
  if (!isAdminEmail(email)) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          error: 'Forbidden: Admin credentials required for internal console access.',
          code: 'FORBIDDEN_ADMIN_REQUIRED',
        },
        { status: 403 }
      ),
    };
  }

  const adminProfile = getAdminUser(email) || {
    email,
    name: authCheck.user.name || 'Platform Admin',
    role: 'admin' as const,
    title: 'Platform Admin',
    department: 'Core Team',
    avatarColor: '#2BB5FF',
    canAccessInternalConsole: true,
    canManageFoundingApplications: true,
    canManageCrm: true,
    canManageRoadmap: true,
    canManageDeployments: true,
  };

  return {
    authenticated: true,
    user: authCheck.user,
    session: authCheck.session,
    adminProfile,
  };
}

/**
 * Validates whether the authenticated user has access to the specified workspace/organization.
 */
export async function validateWorkspaceMembership(
  userId: string,
  workspaceId: string
): Promise<boolean> {
  try {
    // 1. Fetch the workspace organizationId
    const [ws] = await db
      .select({ organizationId: workspaces.organizationId })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!ws) return false;

    // If workspace has no organizationId linked yet (single-tenant workspace in dev), allow access
    if (!ws.organizationId) return true;

    // 2. Check membership in members table
    const [membership] = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.userId, userId),
          eq(members.organizationId, ws.organizationId)
        )
      )
      .limit(1);

    return !!membership;
  } catch (err) {
    console.error('[AuthGuard] Workspace membership check error:', err);
    return false;
  }
}

