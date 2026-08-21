import { NextResponse } from 'next/server';
import { db } from '@/db';
import { staff } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    let staffList = await db
      .select()
      .from(staff)
      .where(workspaceId ? eq(staff.workspaceId, workspaceId) : undefined)
      .orderBy(desc(staff.createdAt));

    if (staffList.length === 0 && workspaceId && process.env.NODE_ENV !== 'production') {
      const defaultStaff = [
        { name: 'Eduardo Moreno', role: 'Master Stylist & Owner', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dennis Müller', role: 'Senior Aesthetician', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Ivo Silva', role: 'Therapy Specialist', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
        { name: 'Agnes K.', role: 'Spa Director', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
      ];

      for (const stf of defaultStaff) {
        const [created] = await db
          .insert(staff)
          .values({
            workspaceId,
            name: stf.name,
            role: stf.role,
            avatarUrl: stf.avatarUrl,
            commissionPercent: 70,
            isActive: true,
          })
          .returning();
        staffList.push(created);
      }
    }

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
