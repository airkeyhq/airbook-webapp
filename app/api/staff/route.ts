import { NextResponse } from 'next/server';
import { db } from '@/db';
import { staff } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    const staffList = await db
      .select()
      .from(staff)
      .where(workspaceId ? eq(staff.workspaceId, workspaceId) : undefined)
      .orderBy(desc(staff.createdAt));

    return NextResponse.json({ success: true, staff: staffList });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch staff.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, name, role, email, phone, avatarEmoji, commissionPercent } = body;

    if (!name) {
      return NextResponse.json({ error: 'Staff name is required.' }, { status: 400 });
    }

    const activeWorkspaceId = await getActiveWorkspaceId(workspaceId);

    const [newStaff] = await db
      .insert(staff)
      .values({
        workspaceId: activeWorkspaceId,
        name,
        role: role || 'Stylist',
        email: email || null,
        phone: phone || null,
        avatarEmoji: avatarEmoji || '👨🏻‍🎨',
        commissionPercent: commissionPercent ?? 70,
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
    const { id, name, role, commissionPercent, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (name) updateFields.name = name;
    if (role) updateFields.role = role;
    if (commissionPercent !== undefined) updateFields.commissionPercent = commissionPercent;
    if (isActive !== undefined) updateFields.isActive = isActive;

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
