import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { foundingApplications } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { syncContactToLoops, sendLoopsEvent } from '@/lib/loops';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name,
      email,
      phone,
      businessName,
      businessType = 'hair_salon',
      city,
      country = 'MX',
      instagramUrl = '',
      websiteUrl = '',
      staffCount = 1,
      monthlyAppointments = '50-150',
      currentSoftware = 'pen_paper',
      primaryPainPoint = '',
      feedbackCommitment = 'biweekly',
      locale = 'es',
      _airbook_hp_check,
    } = body;

    // 1. Anti-bot honeypot check
    if (_airbook_hp_check) {
      console.warn('[Security] Bot founding application blocked via honeypot trap.');
      return NextResponse.json({ error: 'Automated submission rejected.' }, { status: 403 });
    }

    // Determine country from body or edge IP header
    const detectedEdgeCountry = (
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-country-code') ||
      req.headers.get('cloudfront-viewer-country') ||
      ''
    ).trim().toUpperCase();

    const finalCountry = country && country !== 'MX' && country !== 'GLOBAL' ? country : (detectedEdgeCountry || country || 'MX');

    // 2. Validate essential fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return NextResponse.json({ error: 'Phone or WhatsApp number is required.' }, { status: 400 });
    }

    if (!businessName || typeof businessName !== 'string' || businessName.trim().length === 0) {
      return NextResponse.json({ error: 'Business name is required.' }, { status: 400 });
    }

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return NextResponse.json({ error: 'City is required.' }, { status: 400 });
    }

    // 3. Calculate qualification score (0-100)
    let qualificationScore = 50; // base score for completing form
    const parsedStaff = typeof staffCount === 'number' ? staffCount : parseInt(String(staffCount), 10) || 1;
    if (parsedStaff >= 3) qualificationScore += 15;
    if (parsedStaff >= 6) qualificationScore += 10;
    if (monthlyAppointments === '150-300' || monthlyAppointments === '300+') qualificationScore += 15;
    if (feedbackCommitment === 'weekly' || feedbackCommitment === 'biweekly') qualificationScore += 10;

    // 4. Insert into database
    const [createdApp] = await db
      .insert(foundingApplications)
      .values({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        businessName: businessName.trim(),
        businessType: String(businessType),
        city: city.trim(),
        country: String(finalCountry),
        instagramUrl: instagramUrl ? String(instagramUrl).trim() : null,
        websiteUrl: websiteUrl ? String(websiteUrl).trim() : null,
        staffCount: parsedStaff,
        monthlyAppointments: String(monthlyAppointments),
        currentSoftware: String(currentSoftware),
        primaryPainPoint: primaryPainPoint ? String(primaryPainPoint).trim() : null,
        feedbackCommitment: String(feedbackCommitment),
        status: 'pending',
        qualificationScore,
        locale: String(locale),
      })
      .returning();

    // 5. Sync to Loops CRM audience & trigger event
    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || name.trim();
      const lastName = nameParts.slice(1).join(' ') || '';

      await syncContactToLoops({
        email: normalizedEmail,
        firstName,
        lastName,
        userGroup: 'Founding Client Applicant',
        source: 'Founding Program Onboarding',
        customFields: {
          businessName: businessName.trim(),
          businessType: String(businessType),
          city: city.trim(),
          staffCount: parsedStaff,
          monthlyAppointments: String(monthlyAppointments),
          currentSoftware: String(currentSoftware),
          qualificationScore,
          isFoundingApplicant: true,
          program: '2_months_free_founding_client',
        },
      });

      await sendLoopsEvent({
        email: normalizedEmail,
        eventName: 'founding_client_applied',
        eventProperties: {
          businessName: businessName.trim(),
          businessType: String(businessType),
          staffCount: parsedStaff,
          qualificationScore,
        },
      });
    } catch (loopsErr) {
      console.warn('Loops contact sync warning for founding applicant:', loopsErr);
    }

    return NextResponse.json({
      success: true,
      id: createdApp.id,
      applicationReference: `AB-FC-${createdApp.id.slice(0, 8).toUpperCase()}`,
      status: createdApp.status,
      createdAt: createdApp.createdAt,
    });
  } catch (error: any) {
    console.error('Error creating founding application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (email) {
      const [appRecord] = await db
        .select()
        .from(foundingApplications)
        .where(eq(foundingApplications.email, email.trim().toLowerCase()))
        .orderBy(desc(foundingApplications.createdAt))
        .limit(1);

      if (!appRecord) {
        return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
      }

      return NextResponse.json({ application: appRecord });
    }

    // Return recent applications list for CRM view
    const allApps = await db
      .select()
      .from(foundingApplications)
      .orderBy(desc(foundingApplications.createdAt))
      .limit(100);

    return NextResponse.json({ applications: allApps });
  } catch (error: any) {
    console.error('Error querying founding applications:', error);
    return NextResponse.json(
      { error: 'Failed to query applications.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, status, internalNotes, qualificationScore } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Application ID is required.' }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (status !== undefined) updates.status = String(status);
    if (internalNotes !== undefined) updates.internalNotes = String(internalNotes);
    if (qualificationScore !== undefined) updates.qualificationScore = Number(qualificationScore);

    const [updatedApp] = await db
      .update(foundingApplications)
      .set(updates)
      .where(eq(foundingApplications.id, id))
      .returning();

    if (!updatedApp) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    // Sync status change to Loops if approved
    if (status === 'approved') {
      try {
        await sendLoopsEvent({
          email: updatedApp.email,
          eventName: 'founding_client_approved',
          eventProperties: {
            businessName: updatedApp.businessName,
            status: 'approved',
          },
        });
      } catch (loopsErr) {
        console.warn('Loops status event warning:', loopsErr);
      }
    }

    return NextResponse.json({
      success: true,
      application: updatedApp,
    });
  } catch (error: any) {
    console.error('Error updating founding application:', error);
    return NextResponse.json(
      { error: 'Failed to update application.' },
      { status: 500 }
    );
  }
}

