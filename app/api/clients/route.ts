import { NextResponse } from 'next/server';
import { db } from '@/db';
import { clients, appointments } from '@/db/schema';
import { eq, and, ilike, or, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const query = searchParams.get('query');

    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    const whereClause = query
      ? and(
          eq(clients.workspaceId, workspaceId),
          or(
            ilike(clients.name, `%${query}%`),
            ilike(clients.email, `%${query}%`),
            ilike(clients.phone, `%${query}%`)
          )
        )
      : eq(clients.workspaceId, workspaceId);

    let clientList = await db
      .select()
      .from(clients)
      .where(whereClause)
      .orderBy(desc(clients.createdAt));

    // Auto-seed diverse sample clients in development mode if empty
    if (clientList.length === 0 && process.env.NODE_ENV !== 'production') {
      const demoClients = [
        {
          workspaceId,
          name: 'Elena Rostova',
          email: 'elena.rostova@gmail.com',
          phone: '(555) 234-8901',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          totalVisits: 14,
          totalSpentCents: 185000,
          walletBalanceCents: 5000,
          tags: ['VIP', 'Prefers Quiet', 'HydraFacial Fan'],
          preferences: 'Prefers organic herbal tea on arrival. Room temp 72°F.',
          allergies: 'Allergic to synthetic fragrance & tree nut oils.',
          customSpecs: [
            { id: 'spec-1', label: 'Primary Treatment', value: 'HydraFacial Deluxe + LED Light Therapy', date: '2026-08-10' },
            { id: 'spec-2', label: 'Skin Type / Sensitivity', value: 'Fitzpatrick Type II, Moderate Rosacea', date: '2026-08-10' },
            { id: 'spec-3', label: 'Recommended Serum', value: 'Hyaluronic Acid Booster + Vitamin C', date: '2026-08-10' },
          ],
          notes: 'Regular client every 3 weeks. Extremely punctual.',
        },
        {
          workspaceId,
          name: 'Marcus Vance',
          email: 'marcus.vance@studio.co',
          phone: '(555) 345-6789',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          totalVisits: 8,
          totalSpentCents: 92000,
          walletBalanceCents: 0,
          tags: ['Creative Pro', 'Early Bird', 'Express Session'],
          preferences: 'Prefers early morning slots (8am-10am). Sparkling water.',
          allergies: 'None recorded.',
          customSpecs: [
            { id: 'spec-4', label: 'Service Specs', value: 'Beard Sculpting & Clean Razor Fade #1.5', date: '2026-08-05' },
            { id: 'spec-5', label: 'Blade Setting / Foil', value: 'Zero-gap trimmer + hypoallergenic foil finish', date: '2026-08-05' },
          ],
          notes: 'Director of Photography. Needs crisp finish for shoots.',
        },
        {
          workspaceId,
          name: 'Sophia Chen',
          email: 'sophia.chen@wellness.org',
          phone: '(555) 456-7890',
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
          totalVisits: 22,
          totalSpentCents: 320000,
          walletBalanceCents: 15000,
          tags: ['VIP Elite', 'Wellness Member', 'Cashless Only'],
          preferences: 'Prefers lavender essential oil during consultations.',
          allergies: 'Sensitive to eucalyptus.',
          customSpecs: [
            { id: 'spec-6', label: 'Session Focus', value: 'Deep Tissue Body Therapy & Posture Alignment', date: '2026-08-15' },
            { id: 'spec-7', label: 'Target Muscle Groups', value: 'Upper Trapezius & Lower Lumbar decompression', date: '2026-08-15' },
          ],
          notes: 'Long-time member. Leaves generous 25% tips.',
        },
        {
          workspaceId,
          name: 'David Kim',
          email: 'david.kim@techcorp.io',
          phone: '(555) 567-8901',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          totalVisits: 5,
          totalSpentCents: 45000,
          walletBalanceCents: 0,
          tags: ['Tech Executive', 'Prefers Quiet', 'Email Receipts'],
          preferences: 'Prefers working silently during appointments.',
          allergies: 'None.',
          customSpecs: [
            { id: 'spec-8', label: 'Consultation Specs', value: 'Quarterly Executive Grooming & Hair Care', date: '2026-07-28' },
          ],
          notes: 'Books online via company expense card.',
        },
      ];

      for (const demo of demoClients) {
        await db.insert(clients).values(demo as any);
      }

      clientList = await db
        .select()
        .from(clients)
        .where(eq(clients.workspaceId, workspaceId))
        .orderBy(desc(clients.createdAt));
    }

    return NextResponse.json({ success: true, clients: clientList });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch clients.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      name,
      email,
      phone,
      notes,
      preferences,
      allergies,
      tags,
      customSpecs,
      avatarUrl,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Client name is required.' }, { status: 400 });
    }

    const activeWorkspaceId = await getActiveWorkspaceId(workspaceId);

    const [newClient] = await db
      .insert(clients)
      .values({
        workspaceId: activeWorkspaceId,
        name,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
        preferences: preferences || null,
        allergies: allergies || null,
        tags: Array.isArray(tags) ? tags : [],
        customSpecs: Array.isArray(customSpecs) ? customSpecs : [],
        avatarUrl: avatarUrl || null,
        totalVisits: 0,
        totalSpentCents: 0,
      })
      .returning();

    return NextResponse.json({ success: true, client: newClient });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create client.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      email,
      phone,
      notes,
      preferences,
      allergies,
      tags,
      customSpecs,
      avatarUrl,
      medicalWaiversSigned,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required.' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (name) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (notes !== undefined) updateFields.notes = notes;
    if (preferences !== undefined) updateFields.preferences = preferences;
    if (allergies !== undefined) updateFields.allergies = allergies;
    if (tags !== undefined) updateFields.tags = Array.isArray(tags) ? tags : [];
    if (customSpecs !== undefined) updateFields.customSpecs = Array.isArray(customSpecs) ? customSpecs : [];
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;
    if (medicalWaiversSigned !== undefined) updateFields.medicalWaiversSigned = medicalWaiversSigned;

    const [updated] = await db
      .update(clients)
      .set(updateFields)
      .where(eq(clients.id, id))
      .returning();

    return NextResponse.json({ success: true, client: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update client.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required.' }, { status: 400 });
    }

    await db.delete(clients).where(eq(clients.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete client.' }, { status: 500 });
  }
}

