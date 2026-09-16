import { NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, services, staff, schedules } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, businessType, ownerName, email, phone } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Workspace name and slug are required.' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // 1. SMART WORKSPACE CLAIMING CHECK:
    // Check if an unclaimed or pre-created workspace matching the user's email or slug already exists
    let existingWorkspace: typeof workspaces.$inferSelect | undefined;

    if (cleanEmail) {
      const byEmail = await db.select().from(workspaces).where(eq(workspaces.email, cleanEmail)).limit(1);
      if (byEmail.length > 0) {
        existingWorkspace = byEmail[0];
      }
    }

    if (!existingWorkspace) {
      const bySlug = await db.select().from(workspaces).where(eq(workspaces.slug, cleanSlug)).limit(1);
      if (bySlug.length > 0) {
        existingWorkspace = bySlug[0];
      }
    }

    // 2. IF MATCHED: CLAIM AND RECONCILE EXISTING WORKSPACE
    if (existingWorkspace) {
      const claimed = await db.transaction(async (tx) => {
        const [updatedWs] = await tx
          .update(workspaces)
          .set({
            name: name || existingWorkspace!.name,
            managerName: ownerName || existingWorkspace!.managerName,
            email: cleanEmail || existingWorkspace!.email,
            phone: phone || existingWorkspace!.phone,
          })
          .where(eq(workspaces.id, existingWorkspace!.id))
          .returning();

        // Check if owner staff exists
        const existingStaff = await tx
          .select()
          .from(staff)
          .where(eq(staff.workspaceId, existingWorkspace!.id));

        let ownerStaffId = existingStaff[0]?.id;

        if (existingStaff.length === 0) {
          const [newOwnerStaff] = await tx
            .insert(staff)
            .values({
              workspaceId: existingWorkspace!.id,
              name: ownerName || 'Owner',
              email: cleanEmail,
              phone: phone || undefined,
              role: 'Master Specialist & Owner',
              avatarEmoji: '👨🏻‍🎨',
              commissionPercent: 70,
            })
            .returning();
          ownerStaffId = newOwnerStaff.id;
        } else if (cleanEmail && !existingStaff[0].email) {
          await tx
            .update(staff)
            .set({ email: cleanEmail, name: ownerName || existingStaff[0].name })
            .where(eq(staff.id, existingStaff[0].id));
        }

        // Check if schedules exist
        if (ownerStaffId) {
          const existingSchedules = await tx
            .select()
            .from(schedules)
            .where(eq(schedules.staffId, ownerStaffId));

          if (existingSchedules.length === 0) {
            for (let day = 1; day <= 5; day++) {
              await tx.insert(schedules).values({
                staffId: ownerStaffId,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '18:00',
                isWorkingDay: true,
              });
            }
          }
        }

        // Check if services exist
        const existingServices = await tx
          .select()
          .from(services)
          .where(eq(services.workspaceId, existingWorkspace!.id));

        if (existingServices.length === 0) {
          const defaultServices = [
            { name: 'Signature Styling & Precision Cut', category: 'Hair', durationMinutes: 45, priceCents: 7500, colorTag: '#FF4D8D' },
            { name: 'Executive Beard & Hot Towel Treatment', category: 'Barber', durationMinutes: 30, priceCents: 4500, colorTag: '#00C7BE' },
            { name: 'HydraFacial Glow Experience', category: 'Spa', durationMinutes: 60, priceCents: 16000, colorTag: '#9D50BB' },
            { name: 'Deep Tissue Recovery Therapy', category: 'Wellness', durationMinutes: 60, priceCents: 13000, colorTag: '#34C759' },
          ];

          for (const srv of defaultServices) {
            await tx.insert(services).values({
              workspaceId: existingWorkspace!.id,
              name: srv.name,
              category: srv.category,
              durationMinutes: srv.durationMinutes,
              priceCents: srv.priceCents,
              colorTag: srv.colorTag,
              depositCents: Math.round(srv.priceCents * 0.2),
            });
          }
        }

        return updatedWs;
      });

      return NextResponse.json({
        success: true,
        workspace: claimed,
        isClaimed: true,
        message: 'Pre-provisioned CRM workspace successfully claimed and linked to user account.',
      });
    }

    // 3. IF NO MATCH: CREATE NEW WORKSPACE
    const finalSlug = cleanSlug;

    // Create workspace inside transaction
    const result = await db.transaction(async (tx) => {
      const [newWorkspace] = await tx
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

      // Seed initial default staff member (Owner)
      const [ownerStaff] = await tx
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

    return NextResponse.json({ success: true, workspace: result, isClaimed: false });
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
                name: 'Eduardo Moreno',
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

    const allWorkspaces = await db.select().from(workspaces).limit(20);
    return NextResponse.json({ success: true, workspaces: allWorkspaces });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch workspaces.' }, { status: 500 });
  }
}
