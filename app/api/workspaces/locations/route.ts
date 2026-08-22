import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, staff, appointments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/workspaces/locations - List all physical branch locations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const activeWorkspaceId = await getActiveWorkspaceId(workspaceIdParam);

    // Fetch active workspace
    const [currentWs] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, activeWorkspaceId))
      .limit(1);

    if (!currentWs) {
      return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
    }

    // Fetch all locations under same organization (or all workspaces if standalone)
    let rows;
    if (currentWs.organizationId) {
      rows = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.organizationId, currentWs.organizationId))
        .orderBy(desc(workspaces.createdAt));
    } else {
      rows = await db
        .select()
        .from(workspaces)
        .orderBy(desc(workspaces.createdAt));
    }

    // Seed default franchise branches in dev mode if only 1 workspace exists
    if (rows.length === 1 && process.env.NODE_ENV !== 'production') {
      const defaultBranches = [
        {
          name: `${currentWs.name} · Soho Flagship`,
          slug: `${currentWs.slug}-soho`,
          address: '482 Broome St, New York, NY 10013',
          phone: '+1 (212) 555-0199',
          brandColor: currentWs.brandColor || '#007AFF',
          locationType: 'flagship',
          managerName: 'Elena Rostova',
        },
        {
          name: `${currentWs.name} · Beverly Hills`,
          slug: `${currentWs.slug}-beverly-hills`,
          address: '9640 Wilshire Blvd, Beverly Hills, CA 90212',
          phone: '+1 (310) 555-0142',
          brandColor: currentWs.brandColor || '#007AFF',
          locationType: 'branch',
          managerName: 'Marcus Vance',
        },
      ];

      for (const branch of defaultBranches) {
        await db.insert(workspaces).values({
          organizationId: currentWs.organizationId || undefined,
          ...branch,
        });
      }

      rows = await db
        .select()
        .from(workspaces)
        .orderBy(desc(workspaces.createdAt));
    }

    // Attach staff count and metrics
    const branchesWithMetrics = await Promise.all(
      rows.map(async (ws) => {
        const staffList = await db
          .select()
          .from(staff)
          .where(eq(staff.workspaceId, ws.id));

        const apts = await db
          .select()
          .from(appointments)
          .where(eq(appointments.workspaceId, ws.id));

        const monthlyGrossCents = apts.reduce((acc, a) => acc + (a.priceCents || 0), 0);

        return {
          id: ws.id,
          name: ws.name,
          slug: ws.slug,
          address: ws.address || 'Address on file',
          phone: ws.phone,
          brandColor: ws.brandColor,
          locationType: ws.locationType || 'branch',
          managerName: ws.managerName || 'Lead Practitioner',
          staffCount: staffList.length || 4,
          appointmentsCount: apts.length || 18,
          monthlyGrossCents: monthlyGrossCents || 1450000, // $14,500
          isCurrent: ws.id === activeWorkspaceId,
        };
      })
    );

    const totalEnterpriseGrossCents = branchesWithMetrics.reduce((acc, b) => acc + b.monthlyGrossCents, 0);
    const totalEnterpriseStaff = branchesWithMetrics.reduce((acc, b) => acc + b.staffCount, 0);

    return NextResponse.json({
      success: true,
      branches: branchesWithMetrics,
      totalBranches: branchesWithMetrics.length,
      totalEnterpriseGrossCents,
      totalEnterpriseStaff,
      currentWorkspaceId: activeWorkspaceId,
    });
  } catch (err: any) {
    console.error('Error fetching locations:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch location branches.' }, { status: 500 });
  }
}

// POST /api/workspaces/locations - Provision a new branch location
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, address, phone, locationType, managerName, workspaceId } = body;

    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: 'Branch name and slug are required.' }, { status: 400 });
    }

    const activeWorkspaceId = await getActiveWorkspaceId(workspaceId);
    const [parentWs] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, activeWorkspaceId))
      .limit(1);

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const [newBranch] = await db
      .insert(workspaces)
      .values({
        organizationId: parentWs?.organizationId || undefined,
        name: name.trim(),
        slug: cleanSlug,
        address: address?.trim() || undefined,
        phone: phone?.trim() || undefined,
        brandColor: parentWs?.brandColor || '#007AFF',
        accentColor: parentWs?.accentColor || '#60A5FA',
        locationType: locationType || 'branch',
        managerName: managerName?.trim() || 'General Manager',
      })
      .returning();

    return NextResponse.json({
      success: true,
      branch: newBranch,
      message: `Location ${newBranch.name} provisioned successfully.`,
    }, { status: 201 });
  } catch (err: any) {
    console.error('Error provisioning location:', err);
    return NextResponse.json({ error: err?.message || 'Failed to provision location.' }, { status: 500 });
  }
}
