import { NextResponse } from 'next/server';
import { db } from '@/db';
import {
  clients,
  appointments,
  invoices,
  unified_messages,
  signed_waivers,
  kyc_verifications,
} from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetClientId, sourceCustomerIds, sourceClientIds, workspaceId } = body;

    const rawSourceIds = sourceClientIds || sourceCustomerIds;
    if (!targetClientId || !Array.isArray(rawSourceIds) || rawSourceIds.length === 0) {
      return NextResponse.json(
        { error: 'Target client ID and at least one source client ID are required.' },
        { status: 400 }
      );
    }

    const uniqueSourceIds: string[] = Array.from(
      new Set(rawSourceIds.filter((id: string) => id && id !== targetClientId))
    );

    if (uniqueSourceIds.length === 0) {
      return NextResponse.json(
        { error: 'Cannot merge a client into themselves.' },
        { status: 400 }
      );
    }

    const activeWorkspaceId = await getActiveWorkspaceId(workspaceId);

    // Fetch target client
    const [target] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, targetClientId), eq(clients.workspaceId, activeWorkspaceId)));

    if (!target) {
      return NextResponse.json({ error: 'Target client not found.' }, { status: 404 });
    }

    // Fetch source clients
    const sources = await db
      .select()
      .from(clients)
      .where(and(inArray(clients.id, uniqueSourceIds), eq(clients.workspaceId, activeWorkspaceId)));

    if (sources.length === 0) {
      return NextResponse.json({ error: 'No matching source clients found.' }, { status: 404 });
    }

    // Merge profile data
    let updatedEmail = target.email;
    let updatedPhone = target.phone;
    let updatedAvatarUrl = target.avatarUrl;
    let updatedPatchTest = target.patchTestResults;
    let updatedPreferences = target.preferences;
    let updatedAllergies = target.allergies;

    // Tags
    const existingTags = Array.isArray(target.tags) ? target.tags : [];
    const mergedTagsSet = new Set<string>(existingTags);

    // Notes
    const noteParts = [target.notes].filter(Boolean) as string[];

    // Specs
    const mergedSpecsMap = new Map<string, any>();
    if (Array.isArray(target.customSpecs)) {
      target.customSpecs.forEach((s: any) => {
        if (s && s.label) mergedSpecsMap.set(s.label.trim().toLowerCase(), s);
      });
    }

    // Photos
    const mergedPhotosMap = new Map<string, any>();
    if (Array.isArray(target.photos)) {
      target.photos.forEach((p: any) => {
        if (p && (p.beforeUrl || p.afterUrl || p.id)) {
          mergedPhotosMap.set(p.id || `${p.beforeUrl}_${p.afterUrl}`, p);
        }
      });
    }

    let additionalVisits = 0;
    let additionalSpentCents = 0;
    let additionalWalletCents = 0;
    let additionalNoShows = 0;
    let isKycVerified = Boolean(target.isKycVerified);
    let medicalWaiversSigned = Boolean(target.medicalWaiversSigned);

    for (const s of sources) {
      if (!updatedEmail && s.email) updatedEmail = s.email;
      if (!updatedPhone && s.phone) updatedPhone = s.phone;
      if (!updatedAvatarUrl && s.avatarUrl) updatedAvatarUrl = s.avatarUrl;
      if (!updatedPatchTest && s.patchTestResults) updatedPatchTest = s.patchTestResults;

      if (!updatedPreferences && s.preferences) {
        updatedPreferences = s.preferences;
      } else if (s.preferences && !updatedPreferences?.includes(s.preferences)) {
        updatedPreferences = `${updatedPreferences}\n${s.preferences}`.trim();
      }

      if (!updatedAllergies && s.allergies) {
        updatedAllergies = s.allergies;
      } else if (s.allergies && !updatedAllergies?.includes(s.allergies)) {
        updatedAllergies = `${updatedAllergies}\n${s.allergies}`.trim();
      }

      if (Array.isArray(s.tags)) {
        s.tags.forEach((t) => {
          if (typeof t === 'string' && t.trim()) mergedTagsSet.add(t.trim());
        });
      }

      if (s.notes && s.notes.trim() && !noteParts.includes(s.notes.trim())) {
        noteParts.push(s.notes.trim());
      }

      if (Array.isArray(s.customSpecs)) {
        s.customSpecs.forEach((spec: any) => {
          if (spec && spec.label && !mergedSpecsMap.has(spec.label.trim().toLowerCase())) {
            mergedSpecsMap.set(spec.label.trim().toLowerCase(), spec);
          }
        });
      }

      if (Array.isArray(s.photos)) {
        s.photos.forEach((photo: any) => {
          const key = photo?.id || `${photo?.beforeUrl}_${photo?.afterUrl}`;
          if (key && !mergedPhotosMap.has(key)) {
            mergedPhotosMap.set(key, photo);
          }
        });
      }

      additionalVisits += s.totalVisits || 0;
      additionalSpentCents += s.totalSpentCents || 0;
      additionalWalletCents += s.walletBalanceCents || 0;
      additionalNoShows += s.noShowCount || 0;
      if (s.isKycVerified) isKycVerified = true;
      if (s.medicalWaiversSigned) medicalWaiversSigned = true;
    }

    const mergedNotes = noteParts.length > 0 ? noteParts.join('\n\n') : null;

    // Database transaction / update sequence
    // 1. Re-link foreign keys to targetClientId
    await db
      .update(appointments)
      .set({ clientId: targetClientId })
      .where(and(inArray(appointments.clientId, uniqueSourceIds), eq(appointments.workspaceId, activeWorkspaceId)));

    await db
      .update(invoices)
      .set({ clientId: targetClientId })
      .where(and(inArray(invoices.clientId, uniqueSourceIds), eq(invoices.workspaceId, activeWorkspaceId)));

    await db
      .update(unified_messages)
      .set({ clientId: targetClientId })
      .where(and(inArray(unified_messages.clientId, uniqueSourceIds), eq(unified_messages.workspaceId, activeWorkspaceId)));

    await db
      .update(signed_waivers)
      .set({ clientId: targetClientId })
      .where(and(inArray(signed_waivers.clientId, uniqueSourceIds), eq(signed_waivers.workspaceId, activeWorkspaceId)));

    await db
      .update(kyc_verifications)
      .set({ clientId: targetClientId })
      .where(and(inArray(kyc_verifications.clientId, uniqueSourceIds), eq(kyc_verifications.workspaceId, activeWorkspaceId)));

    // 2. Update target client
    const [updatedClient] = await db
      .update(clients)
      .set({
        email: updatedEmail,
        phone: updatedPhone,
        avatarUrl: updatedAvatarUrl,
        notes: mergedNotes,
        preferences: updatedPreferences,
        allergies: updatedAllergies,
        patchTestResults: updatedPatchTest,
        tags: Array.from(mergedTagsSet),
        customSpecs: Array.from(mergedSpecsMap.values()),
        photos: Array.from(mergedPhotosMap.values()),
        totalVisits: (target.totalVisits || 0) + additionalVisits,
        totalSpentCents: (target.totalSpentCents || 0) + additionalSpentCents,
        walletBalanceCents: (target.walletBalanceCents || 0) + additionalWalletCents,
        noShowCount: (target.noShowCount || 0) + additionalNoShows,
        isKycVerified,
        medicalWaiversSigned,
      })
      .where(and(eq(clients.id, targetClientId), eq(clients.workspaceId, activeWorkspaceId)))
      .returning();

    // 3. Delete merged source clients
    await db
      .delete(clients)
      .where(and(inArray(clients.id, uniqueSourceIds), eq(clients.workspaceId, activeWorkspaceId)));

    return NextResponse.json({
      success: true,
      client: updatedClient,
      mergedCount: uniqueSourceIds.length,
    });
  } catch (err: any) {
    console.error('Failed to merge clients:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to merge clients.' },
      { status: 500 }
    );
  }
}
