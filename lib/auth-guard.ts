import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { members, workspaces } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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

    if (!session?.user?.id) {
      return null;
    }

    return session as AuthSessionResult;
  } catch (err) {
    console.warn('[AuthGuard] Failed to resolve session:', err);
    return null;
  }
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
