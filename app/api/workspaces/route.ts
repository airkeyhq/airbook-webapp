import { NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, services, staff, schedules } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { name, slug, businessType, ownerName, email, phone } = body;

    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user?.email && !email) {
        email = session.user.email;
      }
      if (session?.user?.name && !ownerName) {
        ownerName = session.user.name;
      }
    } catch {
      // Session extraction fallback
    }

    if (!name || !slug) {
      return NextResponse.json({ error: 'Workspace name and slug are required.' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // Check if slug is already taken, append unique suffix if needed
    let finalSlug = cleanSlug;
    const existingSlug = await db.select({ id: workspaces.id }).from(workspaces).where(eq(workspaces.slug, finalSlug)).limit(1);
    if (existingSlug.length > 0) {
      finalSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // 1. Create workspace
    const [newWorkspace] = await db
      .insert(workspaces)
      .values({
        name,
        slug: finalSlug,
        email: cleanEmail,
        phone: phone || undefined,
        managerName: ownerName || undefined,
        brandColor: '#007AFF',
        cancellationNoticeHours: 24,
        depositRequiredPercent: 20,
      })
      .returning();

    // 2. Seed initial default staff member (Owner)
    const [ownerStaff] = await db
      .insert(staff)
      .values({
        workspaceId: newWorkspace.id,
        name: ownerName || 'Owner',
        email: cleanEmail,
        phone: phone || undefined,
        role: 'Master Specialist & Owner',
        avatarEmoji: '👨🏻‍🎨',
        commissionPercent: 70,
      })
      .returning();

    // 3. Seed 5 days schedule for owner
    for (let day = 1; day <= 5; day++) {
      await db.insert(schedules).values({
        staffId: ownerStaff.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
        isWorkingDay: true,
      });
    }

    // 4. Seed default services based on business type
    const defaultServices = [
      { name: 'Signature Styling & Precision Cut', category: 'Hair', durationMinutes: 45, priceCents: 7500, colorTag: '#FF4D8D' },
      { name: 'Executive Beard & Hot Towel Treatment', category: 'Barber', durationMinutes: 30, priceCents: 4500, colorTag: '#00C7BE' },
      { name: 'HydraFacial Glow Experience', category: 'Spa', durationMinutes: 60, priceCents: 16000, colorTag: '#9D50BB' },
      { name: 'Deep Tissue Recovery Therapy', category: 'Wellness', durationMinutes: 60, priceCents: 13000, colorTag: '#34C759' },
    ];

    for (const srv of defaultServices) {
      await db.insert(services).values({
        workspaceId: newWorkspace.id,
        name: srv.name,
        category: srv.category,
        durationMinutes: srv.durationMinutes,
        priceCents: srv.priceCents,
        colorTag: srv.colorTag,
        depositCents: Math.round(srv.priceCents * 0.2),
      });
    }

    return NextResponse.json({ success: true, workspace: newWorkspace, isClaimed: false });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create workspace.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      let [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, cleanSlug));

      if (!ws) {
        // In production, strictly return 404 for unknown slugs
        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
        }

        // In development mode only, check if any workspace exists or seed a dev workspace
        const [anyWs] = await db.select().from(workspaces).limit(1);
        if (anyWs) {
          ws = anyWs;
        } else {
          // Auto-seed development salon workspace in DB
          ws = await db.transaction(async (tx) => {
            const [newWs] = await tx
              .insert(workspaces)
              .values({
                name: 'Luxe Hair & Spa Studio',
                slug: cleanSlug || 'my-salon',
                brandColor: '#007AFF',
                cancellationNoticeHours: 24,
                depositRequiredPercent: 20,
              })
              .returning();

            // Seed initial owner staff
            const [ownerStaff] = await tx
              .insert(staff)
              .values({
                workspaceId: newWs.id,
                name: 'Master Specialist',
                role: 'Master Specialist & Owner',
                commissionPercent: 70,
              })
              .returning();

            // Seed 6 days schedule for owner
            for (let day = 1; day <= 6; day++) {
              await tx.insert(schedules).values({
                staffId: ownerStaff.id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '18:00',
                isWorkingDay: true,
              });
            }

            // Seed standard services
            const defaultServices = [
              { name: 'Haircut & Precision Styling', category: 'Hair', durationMinutes: 45, priceCents: 7500, colorTag: '#FF4D8D' },
              { name: 'Beard Sculpting & Hot Towel', category: 'Barber', durationMinutes: 30, priceCents: 4500, colorTag: '#00C7BE' },
              { name: 'HydraFacial Glow Treatment', category: 'Spa', durationMinutes: 60, priceCents: 16000, colorTag: '#9D50BB' },
              { name: 'Deep Tissue Body Therapy', category: 'Wellness', durationMinutes: 60, priceCents: 13000, colorTag: '#34C759' },
            ];

            for (const srv of defaultServices) {
              await tx.insert(services).values({
                workspaceId: newWs.id,
                name: srv.name,
                category: srv.category,
                durationMinutes: srv.durationMinutes,
                priceCents: srv.priceCents,
                colorTag: srv.colorTag,
                depositCents: Math.round(srv.priceCents * 0.2),
              });
            }

            return newWs;
          });
        }
      }
      return NextResponse.json({ success: true, workspace: ws });
    }

    let userWorkspaces: (typeof workspaces.$inferSelect)[] = [];
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user?.email) {
        userWorkspaces = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.email, session.user.email.toLowerCase()))
          .orderBy(desc(workspaces.createdAt));
      }
    } catch {
      // Session extraction fallback
    }

    if (userWorkspaces.length > 0) {
      return NextResponse.json({ success: true, workspaces: userWorkspaces });
    }

    const allWorkspaces = await db
      .select()
      .from(workspaces)
      .orderBy(desc(workspaces.createdAt))
      .limit(20);
    return NextResponse.json({ success: true, workspaces: allWorkspaces });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch workspaces.' }, { status: 500 });
  }
}
