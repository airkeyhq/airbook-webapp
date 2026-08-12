import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET /api/settings - Fetch current workspace settings
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [ws] = await db
      .select()
      .from(workspaces)
      .limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json({ workspace: ws });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/settings - Update workspace settings
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const [ws] = await db
      .select()
      .from(workspaces)
      .limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const [updated] = await db
      .update(workspaces)
      .set({
        name: body.name ?? ws.name,
        slug: body.slug ?? ws.slug,
        phone: body.phone ?? ws.phone,
        logoUrl: body.logoUrl ?? ws.logoUrl,
        cancellationNoticeHours: body.cancellationNoticeHours ?? ws.cancellationNoticeHours,
        depositRequiredPercent: body.depositRequiredPercent ?? ws.depositRequiredPercent,
      })
      .where(eq(workspaces.id, ws.id))
      .returning();

    return NextResponse.json({ workspace: updated });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
