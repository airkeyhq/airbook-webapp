import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { waiver_templates, signed_waivers, clients } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/waivers - List templates and signed waivers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const clientIdParam = searchParams.get('clientId');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    // 1. Fetch templates
    let templates = await db
      .select()
      .from(waiver_templates)
      .where(eq(waiver_templates.workspaceId, workspaceId))
      .orderBy(desc(waiver_templates.createdAt));

    // Seed default standard waiver templates in dev mode if empty
    if (templates.length === 0 && process.env.NODE_ENV !== 'production') {
      const defaultTemplates = [
        {
          title: 'General Health Declaration & Liability Release',
          category: 'General',
          content: `I hereby confirm that I have voluntarily requested beauty, grooming, or wellness services. I declare that I have disclosed all relevant medical conditions, allergies, skin sensitivities, or recent treatments to my service provider.\n\nI understand that results may vary and acknowledge the aftercare guidance provided. I release the service provider and establishment from liability regarding unforeseen allergic reactions or adverse effects resulting from undisclosed pre-existing conditions.`,
          requireSignature: true,
          requirePhotoConsent: true,
          requireAllergyDeclaration: true,
        },
        {
          title: 'Chemical Treatments & Color Consent',
          category: 'Chemical / Hair',
          content: `I acknowledge that chemical processes (such as bleaching, perms, keratin straightening, or vivid coloring) alter the hair structure. A patch test has been offered or performed.\n\nI have truthfully informed the specialist of all past chemical applications (including box dyes, henna, and metallic salts). I understand that past treatments may impact the final outcome and agree to proceed.`,
          requireSignature: true,
          requirePhotoConsent: true,
          requireAllergyDeclaration: true,
        },
        {
          title: 'Aesthetics, Microblading & Skin Peels',
          category: 'Aesthetics',
          content: `I understand that advanced aesthetic procedures (including chemical peels, microneedling, semi-permanent cosmetics, and dermaplaning) involve minor discomfort, temporary redness, or flaking.\n\nI confirm I am not currently taking Accutane, Retin-A, blood thinners, or experiencing active skin infections. I agree to strictly adhere to the post-care protocol provided.`,
          requireSignature: true,
          requirePhotoConsent: true,
          requireAllergyDeclaration: true,
        },
        {
          title: 'Massage & Bodywork Health Intake',
          category: 'Wellness',
          content: `I understand that massage therapy is designed for relaxation, stress relief, and muscular tension relief. It is not a substitute for medical examination or physical therapy.\n\nI agree to immediately inform the therapist if I experience any pain or discomfort during the session so the pressure or technique can be adjusted.`,
          requireSignature: true,
          requirePhotoConsent: false,
          requireAllergyDeclaration: true,
        },
      ];

      for (const t of defaultTemplates) {
        await db.insert(waiver_templates).values({
          workspaceId,
          ...t,
        });
      }

      templates = await db
        .select()
        .from(waiver_templates)
        .where(eq(waiver_templates.workspaceId, workspaceId))
        .orderBy(desc(waiver_templates.createdAt));
    }

    // 2. Fetch signed waivers
    let signedList;
    if (clientIdParam) {
      signedList = await db
        .select()
        .from(signed_waivers)
        .where(eq(signed_waivers.clientId, clientIdParam))
        .orderBy(desc(signed_waivers.signedAt));
    } else {
      signedList = await db
        .select()
        .from(signed_waivers)
        .where(eq(signed_waivers.workspaceId, workspaceId))
        .orderBy(desc(signed_waivers.signedAt));
    }

    return NextResponse.json({
      success: true,
      templates,
      signedWaivers: signedList,
    });
  } catch (err: any) {
    console.error('Error fetching waivers:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch waivers.' }, { status: 500 });
  }
}

// POST /api/waivers - Submit a new digitally signed waiver
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);
    const {
      templateId,
      templateTitle,
      clientId,
      clientName,
      clientEmail,
      clientPhone,
      appointmentId,
      signatureDataUrl,
      agreedClauses,
    } = body;

    if (!clientName?.trim() || !signatureDataUrl) {
      return NextResponse.json({ error: 'Client name and digital signature are required.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'AirBook eSign Engine';

    const [signed] = await db
      .insert(signed_waivers)
      .values({
        workspaceId,
        templateId: templateId || undefined,
        templateTitle: templateTitle || 'General Liability & Health Release',
        clientId: clientId || undefined,
        clientName: clientName.trim(),
        clientEmail: clientEmail?.trim() || undefined,
        clientPhone: clientPhone?.trim() || undefined,
        appointmentId: appointmentId || undefined,
        signatureDataUrl,
        agreedClauses: agreedClauses || {
          termsAgreed: true,
          photoConsent: true,
          allergiesDeclared: true,
        },
        signerIp: ip,
        userAgent,
      })
      .returning();

    return NextResponse.json({
      success: true,
      signedWaiver: signed,
      message: 'Waiver signed and recorded in compliance log.',
    }, { status: 201 });
  } catch (err: any) {
    console.error('Error saving signed waiver:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save signed waiver.' }, { status: 500 });
  }
}

// DELETE /api/waivers - Archive a signed waiver
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Waiver ID is required.' }, { status: 400 });
    }

    await db.delete(signed_waivers).where(eq(signed_waivers.id, id));

    return NextResponse.json({ success: true, message: 'Signed waiver deleted.' });
  } catch (err: any) {
    console.error('Error deleting waiver:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete waiver.' }, { status: 500 });
  }
}
