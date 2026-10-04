import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { resolveGeofenceConfig, evaluateGeofence } from '@/lib/geofence';

// POST /api/geofence/test - Test client distance from salon geofence without issuing cookies
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, workspaceId: providedWorkspaceId } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ error: 'Valid latitude and longitude required' }, { status: 400 });
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
    const evaluation = evaluateGeofence(latitude, longitude, config);

    return NextResponse.json({
      success: true,
      inside: evaluation.inside,
      distanceMeters: evaluation.distanceMeters,
      allowedRadiusMeters: evaluation.allowedRadiusMeters,
    });
  } catch (error: any) {
    console.error('Error testing geofence distance:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
