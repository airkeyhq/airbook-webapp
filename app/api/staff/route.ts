import { NextResponse } from 'next/server';
import { db } from '@/db';
import { staff, workspaces } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { getPlanLimits } from '@/lib/plans';

const DEFAULT_WORKING_HOURS = {
  monday: { enabled: true, start: '09:00', end: '18:00' },
  tuesday: { enabled: true, start: '09:00', end: '18:00' },
  wednesday: { enabled: true, start: '09:00', end: '18:00' },
  thursday: { enabled: true, start: '09:00', end: '18:00' },
  friday: { enabled: true, start: '09:00', end: '18:00' },
  saturday: { enabled: true, start: '10:00', end: '16:00' },
  sunday: { enabled: false, start: '10:00', end: '16:00' },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    let staffList = await db
      .select()
      .from(staff)
      .where(eq(staff.workspaceId, workspaceId))
      .orderBy(desc(staff.createdAt));

    return NextResponse.json({ success: true, staff: staffList });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch staff.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      name,
      role,
      email,
      phone,
      color,
      stationName,
      stationId,
      avatarEmoji,
      avatarUrl,
      commissionPercent,
      workingHours,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Staff name is required.' }, { status: 400 });
    }

    const activeWorkspaceId = await getActiveWorkspaceId(workspaceId);

    // Enforce Plan Limits
    const [ws] = await db
      .select({ plan: workspaces.plan })
      .from(workspaces)
      .where(eq(workspaces.id, activeWorkspaceId))
      .limit(1);

    const limits = getPlanLimits(ws?.plan);
    const [staffCountResult] = await db
      .select({ count: count() })
      .from(staff)
      .where(eq(staff.workspaceId, activeWorkspaceId));

    const currentStaffCount = Number(staffCountResult?.count || 0);
    if (currentStaffCount >= limits.maxStaff) {
      return NextResponse.json(
        {
          error: `Your current plan allows a maximum of ${limits.maxStaff} staff member(s). Upgrade to Team or Scale to add more team members.`,
          code: 'UPGRADE_REQUIRED',
          requiredTier: limits.maxStaff === 1 ? 'team' : 'scale',
          currentCount: currentStaffCount,
          maxAllowed: limits.maxStaff,
        },
        { status: 403 }
      );
    }

    const [newStaff] = await db
      .insert(staff)
      .values({
        workspaceId: activeWorkspaceId,
        name: name.trim(),
        role: role?.trim() || 'Specialist',
        color: color || '#007AFF',
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        stationName: stationName?.trim() || null,
        stationId: stationId || null,
        avatarEmoji: avatarEmoji || '👨🏻‍🎨',
        avatarUrl: avatarUrl || null,
        commissionPercent: commissionPercent !== undefined ? Number(commissionPercent) : 70,
        workingHours: workingHours || DEFAULT_WORKING_HOURS,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to add staff member.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      role,
      color,
      email,
      phone,
      stationName,
      stationId,
      commissionPercent,
      workingHours,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (role !== undefined) updateFields.role = role.trim();
    if (color !== undefined) updateFields.color = color;
    if (email !== undefined) updateFields.email = email ? email.trim() : null;
    if (phone !== undefined) updateFields.phone = phone ? phone.trim() : null;
    if (stationName !== undefined) updateFields.stationName = stationName ? stationName.trim() : null;
    if (stationId !== undefined) updateFields.stationId = stationId || null;
    if (commissionPercent !== undefined) updateFields.commissionPercent = Number(commissionPercent);
    if (workingHours !== undefined) updateFields.workingHours = workingHours;
    if (isActive !== undefined) updateFields.isActive = Boolean(isActive);

    const [updated] = await db
      .update(staff)
      .set(updateFields)
      .where(eq(staff.id, id))
      .returning();

    return NextResponse.json({ success: true, staff: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update staff member.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required.' }, { status: 400 });
    }

    await db.delete(staff).where(eq(staff.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete staff member.' }, { status: 500 });
  }
}
