import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, compliance_logs, members } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers, cookies } from 'next/headers';
import { getActiveWorkspaceId } from '@/lib/workspace';
import {
  resolveGeofenceConfig,
  verifyGeofenceToken,
  getGeofenceCookieName,
  isMobileUserAgent,
  isIpTrusted,
  type GeofenceConfig,
} from '@/lib/geofence';
import { generatePinSalt, hashSupervisorPin } from '@/lib/supervisor-pin';

// GET /api/geofence - Fetch geofence configuration and verify whether current client requires gate check
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { searchParams } = new URL(req.url);
    const workspaceId = await getActiveWorkspaceId(searchParams.get('workspaceId'));

    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const config = resolveGeofenceConfig(ws.geofencing);
    const hasSupervisorPin = Boolean(ws.supervisorPinHash && ws.supervisorPinSalt);

    // If geofencing is not enabled, no gate required
    if (!config.enabled) {
      return NextResponse.json({
        success: true,
        config,
        hasSupervisorPin,
        salonName: ws.name,
        geofenceRequired: false,
      });
    }

    // Role detection
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

    // Network & Device inspection
    const reqHeaders = await headers();
    const userAgent = reqHeaders.get('user-agent') || '';
    const forwardedFor = reqHeaders.get('x-forwarded-for');
    const realIp = reqHeaders.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

    const isMobile = isMobileUserAgent(userAgent);
    const isExemptRole = config.exemptAdmins && (role === 'owner' || role === 'admin');
    const isEnforcedRole = config.enforcedRoles.includes(role as any);
    const isDeviceEnforced = config.deviceScope === 'all' || isMobile;
    const isTrustedNetwork = isIpTrusted(clientIp, config.trustedIps);

    let geofenceRequired = false;

    if (!isExemptRole && isEnforcedRole && isDeviceEnforced && !isTrustedNetwork) {
      const cookieStore = await cookies();
      const cookieName = getGeofenceCookieName(ws.id);
      const token = cookieStore.get(cookieName)?.value;
      const validSession = verifyGeofenceToken(token, ws.id, session?.user?.id);

      if (!validSession) {
        geofenceRequired = true;
      }
    }

    return NextResponse.json({
      success: true,
      config,
      hasSupervisorPin,
      salonName: ws.name,
      geofenceRequired,
      role,
      isMobile,
      clientIp,
    });
  } catch (error: any) {
    console.error('Error fetching geofence config:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/geofence - Update salon geofence configuration or supervisor PIN
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const currentConfig = resolveGeofenceConfig(ws.geofencing);
    const configUpdate: Partial<GeofenceConfig> = body.config || {};

    const updatedConfig: GeofenceConfig = {
      ...currentConfig,
      ...configUpdate,
      latitude:
        typeof configUpdate.latitude === 'number' && !Number.isNaN(configUpdate.latitude)
          ? configUpdate.latitude
          : configUpdate.latitude === null
          ? null
          : currentConfig.latitude,
      longitude:
        typeof configUpdate.longitude === 'number' && !Number.isNaN(configUpdate.longitude)
          ? configUpdate.longitude
          : configUpdate.longitude === null
          ? null
          : currentConfig.longitude,
    };

    const updateFields: Record<string, any> = {
      geofencing: updatedConfig,
    };

    // If supervisor PIN is provided (4-6 digits)
    if (typeof body.supervisorPin === 'string' && body.supervisorPin.trim().length >= 4) {
      const salt = generatePinSalt();
      const hash = hashSupervisorPin(body.supervisorPin.trim(), salt);
      updateFields.supervisorPinSalt = salt;
      updateFields.supervisorPinHash = hash;
    }

    const [updatedWs] = await db
      .update(workspaces)
      .set(updateFields)
      .where(eq(workspaces.id, ws.id))
      .returning();

    // Log to immutable compliance logs
    try {
      await db.insert(compliance_logs).values({
        workspaceId: ws.id,
        actorId: session.user.id,
        actorName: session.user.name || 'Salon Operator',
        actorRole: 'Owner/Manager',
        action: 'update_geofence',
        resourceType: 'system',
        resourceName: `${ws.name} Perimeter Geofence`,
        details: `Updated geofence: enabled=${updatedConfig.enabled}, radius=${updatedConfig.radiusMeters}m, scope=${updatedConfig.deviceScope}`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'AirBook Web',
      });
    } catch (auditErr) {
      console.warn('Failed to record compliance audit log:', auditErr);
    }

    return NextResponse.json({
      success: true,
      config: resolveGeofenceConfig(updatedWs.geofencing),
      hasSupervisorPin: Boolean(updatedWs.supervisorPinHash && updatedWs.supervisorPinSalt),
    });
  } catch (error: any) {
    console.error('Error updating geofence config:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
