import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
  foundingApplications,
  workspaces,
  staff,
  schedules,
  services,
  users,
  organizations,
  members,
  invitations,
} from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { syncContactToLoops, sendLoopsEvent } from '@/lib/loops';
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';
import { requireAuthSession, requireAdminSession } from '@/lib/auth-guard';
import { determineFoundingTier, AIRBOOK_PLAN_DEFINITIONS } from '@/lib/plans';
import { provisionFoundingStripeCustomer } from '@/lib/stripe';
import { sendFoundingInvitationEmail, sendFoundingApplicationReceivedEmail } from '@/lib/notifications';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // 0. Volumetric Rate Limiting (max 15 founding applications per 10 minutes per IP)
    const rateLimit = checkRateLimit(req, {
      limit: 15,
      windowSeconds: 600,
      prefix: 'founding_application',
    });
    if (!rateLimit.allowed) {
      return rateLimitExceededResponse(rateLimit);
    }

    const body = await req.json().catch(() => ({}));
    const {
      name,
      firstName: rawFirstName,
      lastName: rawLastName,
      email,
      phone,
      businessName,
      businessType = 'hair_salon',
      city,
      state: rawState = '',
      country = 'MX',
      preferredLanguage: rawPreferredLanguage,
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

    // Resolve granular names
    let finalFirstName = (rawFirstName || '').trim();
    let finalLastName = (rawLastName || '').trim();
    let finalFullName = (name || '').trim();

    if (!finalFullName && (finalFirstName || finalLastName)) {
      finalFullName = `${finalFirstName} ${finalLastName}`.trim();
    } else if (finalFullName && (!finalFirstName || !finalLastName)) {
      const parts = finalFullName.split(' ');
      finalFirstName = parts[0] || '';
      finalLastName = parts.slice(1).join(' ') || '';
    }

    // Resolve preferred language
    const finalLanguage = (rawPreferredLanguage || locale || 'es').toLowerCase().trim();

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
    if (!finalFullName || finalFullName.length === 0) {
      return NextResponse.json({ error: 'First name and last name are required.' }, { status: 400 });
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
        name: finalFullName,
        firstName: finalFirstName,
        lastName: finalLastName,
        email: normalizedEmail,
        phone: phone.trim(),
        businessName: businessName.trim(),
        businessType: String(businessType),
        city: city.trim(),
        state: rawState ? String(rawState).trim() : null,
        country: String(finalCountry),
        preferredLanguage: finalLanguage,
        instagramUrl: instagramUrl ? String(instagramUrl).trim() : null,
        websiteUrl: websiteUrl ? String(websiteUrl).trim() : null,
        staffCount: parsedStaff,
        monthlyAppointments: String(monthlyAppointments),
        currentSoftware: String(currentSoftware),
        primaryPainPoint: primaryPainPoint ? String(primaryPainPoint).trim() : null,
        feedbackCommitment: String(feedbackCommitment),
        status: 'pending',
        qualificationScore,
        locale: finalLanguage,
      })
      .returning();

    // 5. Sync to Loops CRM audience & trigger event
    try {
      await syncContactToLoops({
        email: normalizedEmail,
        firstName: finalFirstName,
        lastName: finalLastName,
        userGroup: 'Founding Client Applicant',
        source: 'Founding Program Onboarding',
        customFields: {
          businessName: businessName.trim(),
          businessType: String(businessType),
          city: city.trim(),
          state: rawState ? String(rawState).trim() : '',
          preferredLanguage: finalLanguage,
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

    const applicationReference = `AB-FC-${createdApp.id.slice(0, 8).toUpperCase()}`;

    // 6. Send immediate confirmation email with application reference
    try {
      await sendFoundingApplicationReceivedEmail({
        email: normalizedEmail,
        applicantName: finalFirstName || finalFullName,
        businessName: businessName.trim(),
        referenceNumber: applicationReference,
        locale: finalLanguage,
      });
    } catch (emailErr) {
      console.warn('Failed to send founding application confirmation email:', emailErr);
    }

    return NextResponse.json({
      success: true,
      id: createdApp.id,
      applicationReference,
      status: createdApp.status,
      createdAt: createdApp.createdAt,
    });
  } catch (error: any) {
    console.error('Error creating founding application:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing application.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (email) {
      const authCheck = await requireAuthSession();
      if (!authCheck.authenticated) {
        return authCheck.response;
      }

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

    // Listing all applications requires executive admin session (Eduardo/Raul)
    const adminCheck = await requireAdminSession();
    if (!adminCheck.authenticated) {
      return adminCheck.response;
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
    const adminCheck = await requireAdminSession();
    if (!adminCheck.authenticated) {
      return adminCheck.response;
    }

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

    let provisioningResult: {
      workspaceId?: string;
      workspaceSlug?: string;
      tier?: string;
      stripeCustomerId?: string;
      activationUrl?: string;
      emailSent?: boolean;
    } = {};

    // Execute complete Onboarding, Stripe Grandfathering & Invitation flow when approved
    if (status === 'approved') {
      try {
        const applicantEmail = updatedApp.email.toLowerCase().trim();
        const applicantName = updatedApp.name.trim();
        const businessName = updatedApp.businessName.trim();

        // 1. Determine matched commercial tier based on team size and appointment volume
        const matchedTier = determineFoundingTier({
          staffCount: updatedApp.staffCount,
          monthlyAppointments: updatedApp.monthlyAppointments,
          businessType: updatedApp.businessType,
        });
        const tierDefinition = AIRBOOK_PLAN_DEFINITIONS[matchedTier];

        // 2. Check if a workspace already exists for this business/email, or create one
        let existingWs = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.email, applicantEmail))
          .limit(1)
          .then((res) => res[0]);

        const rawSlug = businessName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 50);
        let finalSlug = rawSlug || `salon-${Math.random().toString(36).substring(2, 7)}`;

        if (!existingWs) {
          // Check slug uniqueness
          const [slugConflict] = await db
            .select({ id: workspaces.id })
            .from(workspaces)
            .where(eq(workspaces.slug, finalSlug))
            .limit(1);

          if (slugConflict) {
            finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
          }

          // 3. Create workspace in pilot status (2 months free grace period)
          const [createdWs] = await db
            .insert(workspaces)
            .values({
              name: businessName,
              slug: finalSlug,
              email: applicantEmail,
              phone: updatedApp.phone,
              managerName: applicantName,
              plan: matchedTier,
              subscriptionStatus: 'pilot_active',
              brandColor: '#2BB5FF',
              cancellationNoticeHours: 24,
              depositRequiredPercent: 20,
              smsCreditsRemaining: matchedTier === 'scale' ? 2500 : matchedTier === 'team' ? 500 : 100,
            })
            .returning();
          existingWs = createdWs;

          // Seed default owner staff profile
          const [ownerStaff] = await db
            .insert(staff)
            .values({
              workspaceId: existingWs.id,
              name: applicantName,
              email: applicantEmail,
              phone: updatedApp.phone,
              role: 'Master Specialist & Director',
              avatarEmoji: '✨',
              commissionPercent: 100,
            })
            .returning();

          // Seed Monday-Friday default shift
          for (let day = 1; day <= 5; day++) {
            await db.insert(schedules).values({
              staffId: ownerStaff.id,
              dayOfWeek: day,
              startTime: '09:00',
              endTime: '18:00',
              isWorkingDay: true,
            });
          }

          // Seed core luxury services
          const defaultServices = [
            { name: 'Signature Styling & Precision Cut', category: 'Hair', durationMinutes: 45, priceCents: 7500, colorTag: '#FF4D8D' },
            { name: 'Executive Grooming & Hot Towel', category: 'Barber', durationMinutes: 30, priceCents: 4500, colorTag: '#00C7BE' },
            { name: 'HydraFacial Radiance Glow', category: 'Spa', durationMinutes: 60, priceCents: 16000, colorTag: '#9D50BB' },
          ];

          for (const srv of defaultServices) {
            await db.insert(services).values({
              workspaceId: existingWs.id,
              name: srv.name,
              category: srv.category,
              durationMinutes: srv.durationMinutes,
              priceCents: srv.priceCents,
              colorTag: srv.colorTag,
              depositCents: Math.round(srv.priceCents * 0.2),
            });
          }
        } else {
          // Update existing workspace to pilot_active on the approved tier
          await db
            .update(workspaces)
            .set({
              plan: matchedTier,
              subscriptionStatus: 'pilot_active',
            })
            .where(eq(workspaces.id, existingWs.id));
        }

        // 4. Provision Stripe Customer with 60 Days Free Trial & Lifetime Grandfathered 50% Rate
        const stripeProvision = await provisionFoundingStripeCustomer({
          email: applicantEmail,
          name: applicantName,
          businessName,
          workspaceId: existingWs.id,
          tier: matchedTier as 'solo' | 'team' | 'scale',
          trialDays: 60, // 2 full months
        });

        // Link Stripe Customer ID to workspace
        await db
          .update(workspaces)
          .set({
            stripeCustomerId: stripeProvision.customerId,
          })
          .where(eq(workspaces.id, existingWs.id));

        // 5. Check or create User & Organization
        let [dbUser] = await db.select().from(users).where(eq(users.email, applicantEmail)).limit(1);
        if (!dbUser) {
          const [newUser] = await db
            .insert(users)
            .values({
              id: `usr_${crypto.randomUUID()}`,
              name: applicantName,
              email: applicantEmail,
              emailVerified: false,
            })
            .returning();
          dbUser = newUser;
        }

        let orgId = existingWs.organizationId;
        if (!orgId) {
          const [newOrg] = await db
            .insert(organizations)
            .values({
              id: `org_${crypto.randomUUID()}`,
              name: businessName,
              slug: finalSlug,
            })
            .returning();
          orgId = newOrg.id;

          await db
            .update(workspaces)
            .set({ organizationId: orgId })
            .where(eq(workspaces.id, existingWs.id));
        }

        // Add or ensure organization membership
        const [existingMember] = await db
          .select()
          .from(members)
          .where(eq(members.userId, dbUser.id))
          .limit(1);

        if (!existingMember) {
          await db.insert(members).values({
            id: `mem_${crypto.randomUUID()}`,
            organizationId: orgId,
            userId: dbUser.id,
            role: 'owner',
          });
        }

        // 6. Generate single-use invitation record with 30-day onboarding window
        const inviteExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const inviteToken = crypto.randomBytes(24).toString('hex');

        // Delete any old pending invitation for this email
        await db.delete(invitations).where(eq(invitations.email, applicantEmail));

        await db.insert(invitations).values({
          id: `inv_${inviteToken.slice(0, 16)}`,
          organizationId: orgId,
          email: applicantEmail,
          role: 'owner',
          status: 'pending',
          expiresAt: inviteExpiresAt,
          inviterId: adminCheck.user.id,
        });

        // 7. Generate Activation URL
        const appBaseUrl =
          process.env.NEXT_PUBLIC_APP_URL ||
          (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
          'https://getairbook.com';

        const activationUrl = `${appBaseUrl}/login?email=${encodeURIComponent(
          applicantEmail
        )}&mode=signin&redirect=${encodeURIComponent(
          `/onboarding?foundingId=${updatedApp.id}&token=${inviteToken}`
        )}`;

        // 8. Dispatch Founding Client Invitation Email
        const emailResult = await sendFoundingInvitationEmail({
          email: applicantEmail,
          applicantName,
          businessName,
          tierName: tierDefinition.name,
          activationUrl,
          freeTrialMonths: 2,
          grandfatheredDiscountPercent: stripeProvision.grandfatheredDiscountPercent,
        });

        // 9. Sync updated contact & send Loops approval event
        const applicantFirst = updatedApp.firstName || applicantName.split(' ')[0] || applicantName;
        const applicantLast = updatedApp.lastName || applicantName.split(' ').slice(1).join(' ') || '';

        await syncContactToLoops({
          email: applicantEmail,
          firstName: applicantFirst,
          lastName: applicantLast,
          userGroup: 'Founding Client Approved',
          source: 'Founding Program Approvals',
          customFields: {
            isFoundingApproved: true,
            foundingTier: matchedTier,
            foundingTierName: tierDefinition.name,
            freeTrialMonths: 2,
            stripeCustomerId: stripeProvision.customerId,
            pilotEndsAt: stripeProvision.trialEndsAt.toISOString(),
            activationUrl,
            workspaceSlug: existingWs.slug,
            preferredLanguage: updatedApp.preferredLanguage || updatedApp.locale || 'es',
            city: updatedApp.city,
            state: updatedApp.state || '',
            country: updatedApp.country,
          },
        }).catch((err) => console.warn('Loops contact sync warning:', err));

        await sendLoopsEvent({
          email: applicantEmail,
          eventName: 'founding_client_approved',
          eventProperties: {
            businessName,
            tier: matchedTier,
            tierName: tierDefinition.name,
            activationUrl,
            pilotDaysFree: 60,
          },
        }).catch((err) => console.warn('Loops event warning:', err));

        provisioningResult = {
          workspaceId: existingWs.id,
          workspaceSlug: existingWs.slug,
          tier: matchedTier,
          stripeCustomerId: stripeProvision.customerId,
          activationUrl,
          emailSent: emailResult.success,
        };
      } catch (provisionErr: any) {
        console.error('Error during founding approval provisioning:', provisionErr);
      }
    }

    return NextResponse.json({
      success: true,
      application: updatedApp,
      provisioning: provisioningResult,
    });
  } catch (error: any) {
    console.error('Error updating founding application:', error);
    return NextResponse.json(
      { error: 'Failed to update application.' },
      { status: 500 }
    );
  }
}

