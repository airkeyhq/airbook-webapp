import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, compliance_logs, members } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers, cookies } from 'next/headers';
import { getActiveWorkspaceId } from '@/lib/workspace';
import {
  resolveGeofenceConfig,
  signGeofencePayload,
  getGeofenceCookieName,
  type GeofenceSessionPayload,
} from '@/lib/geofence';
import { verifySupervisorPin } from '@/lib/supervisor-pin';

// POST /api/geofence/bypass - Front desk emergency bypass with Supervisor PIN
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await req.json();
    const { pin, reason, workspaceId: providedWorkspaceId } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ error: 'Supervisor PIN is required' }, { status: 400 });
    }

    const workspaceId = await getActiveWorkspaceId(providedWorkspaceId);

    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const config = resolveGeofenceConfig(ws.geofencing);

    if (!config.allowSupervisorBypass) {
      return NextResponse.json(
        { error: 'Supervisor bypass is not enabled for this salon' },
        { status: 403 }
      );
    }

    if (!ws.supervisorPinHash || !ws.supervisorPinSalt) {
      return NextResponse.json(
        { error: 'No supervisor PIN has been configured for this salon' },
        { status: 400 }
      );
    }

    const isValid = verifySupervisorPin(pin, ws.supervisorPinHash, ws.supervisorPinSalt);

    if (!isValid) {
      return NextResponse.json({ error: 'invalid_pin' }, { status: 401 });
    }

    let role = 'member';
    if (session?.user?.id && ws.organizationId) {
      const [memberRecord] = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.organizationId, ws.organizationId),
            eq(members.userId, session.user.id)
          )
        )
        .limit(1);
      if (memberRecord?.role) {
        role = memberRecord.role;
      }
    }

    const now = Date.now();
    const bypassHours = Math.min(config.sessionDurationHours, 8);
    const expiresAt = now + bypassHours * 3600 * 1000;

    const payload: GeofenceSessionPayload = {
      workspaceId: ws.id,
      userId: session?.user?.id || 'anonymous_staff',
      role,
      verifiedAt: now,
      expiresAt,
      type: 'supervisor_bypass',
    };

    const token = signGeofencePayload(payload);
    const cookieStore = await cookies();
    const cookieName = getGeofenceCookieName(ws.id);

    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: bypassHours * 3600,
    });

    try {
      await db.insert(compliance_logs).values({
        workspaceId: ws.id,
        actorId: session?.user?.id,
        actorName: session?.user?.name || 'Salon Staff',
        actorRole: role,
        action: 'geofence_bypassed',
        resourceType: 'system',
        resourceName: 'Salon Perimeter Gate',
        details: `Supervisor emergency override authorized for ${bypassHours}h: reason="${reason || 'Supervisor Emergency Override'}"`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'AirBook Web',
      });
    } catch (e) {
      console.warn('Failed to audit log bypass:', e);
    }

    return NextResponse.json({ success: true, bypassHours });
  } catch (error: any) {
    console.error('Error bypassing geofence:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
