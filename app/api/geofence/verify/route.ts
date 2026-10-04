import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, compliance_logs, members } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers, cookies } from 'next/headers';
import { getActiveWorkspaceId } from '@/lib/workspace';
import {
  resolveGeofenceConfig,
  evaluateGeofence,
  signGeofencePayload,
  getGeofenceCookieName,
  type GeofenceSessionPayload,
} from '@/lib/geofence';

// POST /api/geofence/verify - Verify client GPS coordinates against salon perimeter
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await req.json();
    const { latitude, longitude, accuracy } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ error: 'Valid latitude and longitude required' }, { status: 400 });
    }

    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const config = resolveGeofenceConfig(ws.geofencing);

    // If geofencing is disabled, instantly approve
    if (!config.enabled) {
      return NextResponse.json({ success: true, message: 'Geofencing not enabled' });
    }

    const evaluation = evaluateGeofence(latitude, longitude, config);

    // Determine user role
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
    const expiresAt = now + config.sessionDurationHours * 3600 * 1000;
    const cookieStore = await cookies();
    const cookieName = getGeofenceCookieName(ws.id);

    if (evaluation.inside) {
      // Within perimeter - sign tamper-proof session token
      const payload: GeofenceSessionPayload = {
        workspaceId: ws.id,
        userId: session?.user?.id || 'anonymous_staff',
        role,
        verifiedAt: now,
        expiresAt,
        type: 'gps',
      };

      const token = signGeofencePayload(payload);

      cookieStore.set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: config.sessionDurationHours * 3600,
      });

      // Audit log success
      try {
        await db.insert(compliance_logs).values({
          workspaceId: ws.id,
          actorId: session?.user?.id,
          actorName: session?.user?.name || 'Salon Staff',
          actorRole: role,
          action: 'geofence_verified',
          resourceType: 'system',
          resourceName: 'Salon Perimeter Gate',
          details: `GPS Location verified: distance=${evaluation.distanceMeters ?? 0}m, allowed=${config.radiusMeters}m, accuracy=${accuracy ?? 'N/A'}m`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
          userAgent: req.headers.get('user-agent') || 'AirBook Web',
        });
      } catch (e) {
        console.warn('Failed to audit log verification:', e);
      }

      return NextResponse.json({
        success: true,
        distanceMeters: evaluation.distanceMeters,
        allowedRadiusMeters: evaluation.allowedRadiusMeters,
      });
    }

    // Outside perimeter
    try {
      await db.insert(compliance_logs).values({
        workspaceId: ws.id,
        actorId: session?.user?.id,
        actorName: session?.user?.name || 'Salon Staff',
        actorRole: role,
        action: 'geofence_blocked',
        resourceType: 'system',
        resourceName: 'Salon Perimeter Gate',
        details: `Outside geofence: distance=${evaluation.distanceMeters ?? 0}m, allowed=${config.radiusMeters}m, strictness=${config.strictness}`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'AirBook Web',
      });
    } catch (e) {
      console.warn('Failed to audit log blocked attempt:', e);
    }

    if (config.strictness === 'warn_and_audit') {
      // Allow access with warning
      const payload: GeofenceSessionPayload = {
        workspaceId: ws.id,
        userId: session?.user?.id || 'anonymous_staff',
        role,
        verifiedAt: now,
        expiresAt,
        type: 'gps',
      };

      const token = signGeofencePayload(payload);

      cookieStore.set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: config.sessionDurationHours * 3600,
      });

      return NextResponse.json({
        success: true,
        warned: true,
        distanceMeters: evaluation.distanceMeters,
        allowedRadiusMeters: evaluation.allowedRadiusMeters,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'outside_geofence',
        distanceMeters: evaluation.distanceMeters,
        allowedRadiusMeters: evaluation.allowedRadiusMeters,
      },
      { status: 403 }
    );
  } catch (error: any) {
    console.error('Error verifying location:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
