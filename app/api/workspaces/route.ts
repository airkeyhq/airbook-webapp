import { NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, services, staff, schedules } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, businessType } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Workspace name and slug are required.' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Check if slug exists
    const existing = await db.select().from(workspaces).where(eq(workspaces.slug, cleanSlug));
    const finalSlug = existing.length > 0 ? `${cleanSlug}-${Date.now().toString().slice(-4)}` : cleanSlug;

    // Create workspace inside transaction
    const result = await db.transaction(async (tx) => {
      const [newWorkspace] = await tx
        .insert(workspaces)
        .values({
          name,
          slug: finalSlug,
          brandColor: '#007AFF',
          cancellationNoticeHours: 24,
          depositRequiredPercent: 20,
        })
        .returning();

      // Seed initial default staff member (Owner)
      const [ownerStaff] = await tx
        .insert(staff)
        .values({
          workspaceId: newWorkspace.id,
          name: 'Eduardo Moreno',
          role: 'Master Specialist & Owner',
          avatarEmoji: '👨🏻‍🎨',
          commissionPercent: 70,
        })
        .returning();

      // Seed 5 days schedule for owner
      for (let day = 1; day <= 5; day++) {
        await tx.insert(schedules).values({
          staffId: ownerStaff.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isWorkingDay: true,
        });
      }

      // Seed default services based on business type
      const defaultServices = [
        { name: 'Signature Styling & Precision Cut', category: 'Hair', durationMinutes: 45, priceCents: 7500, colorTag: '#FF4D8D' },
        { name: 'Executive Beard & Hot Towel Treatment', category: 'Barber', durationMinutes: 30, priceCents: 4500, colorTag: '#00C7BE' },
        { name: 'HydraFacial Glow Experience', category: 'Spa', durationMinutes: 60, priceCents: 16000, colorTag: '#9D50BB' },
        { name: 'Deep Tissue Recovery Therapy', category: 'Wellness', durationMinutes: 60, priceCents: 13000, colorTag: '#34C759' },
      ];

      for (const srv of defaultServices) {
        await tx.insert(services).values({
          workspaceId: newWorkspace.id,
          name: srv.name,
          category: srv.category,
          durationMinutes: srv.durationMinutes,
          priceCents: srv.priceCents,
          colorTag: srv.colorTag,
          depositCents: Math.round(srv.priceCents * 0.2),
        });
      }

      return newWorkspace;
    });

    return NextResponse.json({ success: true, workspace: result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create workspace.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug));
      if (!ws) {
        return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, workspace: ws });
    }

    const allWorkspaces = await db.select().from(workspaces).limit(20);
    return NextResponse.json({ success: true, workspaces: allWorkspaces });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch workspaces.' }, { status: 500 });
  }
}
