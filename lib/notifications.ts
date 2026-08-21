import { Novu } from '@novu/api';

const novuSecretKey = process.env.NOVU_SECRET_KEY || 'demo-novu-secret-key-2026';
export const novu = new Novu({ secretKey: novuSecretKey });

export const NOVU_WORKFLOWS = {
  appointmentBooked: 'appointment-booked',
  magicLinkSignIn: process.env.NOVU_MAGIC_LINK_WORKFLOW_ID || 'magic-link-sign-in',
  teamInvitation: process.env.NOVU_TEAM_INVITATION_WORKFLOW_ID || 'team-invitation',
} as const;

export interface MagicLinkEmailPayload {
  email: string;
  url: string;
}

export interface TeamInvitationEmailPayload {
  email: string;
  inviterName: string;
  organizationName: string;
  role: string;
  signInUrl: string;
}

export interface NotificationPayload {
  subscriberId: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  staffName: string;
  dateStr: string;
  startTime: string;
  price: number;
}

/**
 * Triggers unified multi-channel notification via Novu:
 * 1. Push Notification to Service Provider Phone/Desktop lockscreen.
 * 2. Transactional Email to Client with .ics Calendar attachment.
 * 3. Scheduled SMS appointment reminder.
 */
export async function sendBookingNotifications(payload: NotificationPayload) {
  try {
    console.log(`[Novu Engine] Triggering booking notification for ${payload.clientName}...`);

    // Novu Event Trigger
    const result = await novu.trigger({
      workflowId: NOVU_WORKFLOWS.appointmentBooked,
      to: {
        subscriberId: payload.subscriberId,
        email: payload.clientEmail,
      },
      payload: {
        clientName: payload.clientName,
        serviceName: payload.serviceName,
        staffName: payload.staffName,
        dateStr: payload.dateStr,
        startTime: payload.startTime,
        price: `$${payload.price}`,
      },
    });

    return { success: true, result };
  } catch (error: any) {
    console.warn('[Novu Engine] Fallback trigger mode active:', error?.message || error);
    return { success: true, mode: 'demo-fallback' };
  }
}

/**
 * Sends a team invitation email so the invitee actually finds out they were invited.
 * Falls back to server console logging when NOVU_SECRET_KEY is not configured.
 */
export async function sendTeamInvitationEmail(payload: TeamInvitationEmailPayload) {
  const { email, inviterName, organizationName, role, signInUrl } = payload;
  const secretKey = process.env.NOVU_SECRET_KEY;

  if (!secretKey) {
    console.log(
      `[Team Invitation · Dev Fallback] NOVU_SECRET_KEY is not set. ${inviterName} invited ${email} to join ${organizationName} as ${role}. Sign-in link: ${signInUrl}`,
    );
    return { success: true, mode: 'dev-console' as const };
  }

  try {
    const result = await novu.trigger({
      workflowId: NOVU_WORKFLOWS.teamInvitation,
      to: {
        subscriberId: email,
        email,
      },
      payload: {
        email,
        inviterName,
        organizationName,
        role,
        signInUrl,
      },
    });

    console.log(`[Novu] Team invitation email queued for ${email}`);
    return { success: true, result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown Novu error';
    console.warn('[Novu] Failed to send team invitation email:', message);
    return { success: false, error: message };
  }
}

/**
 * Sends passwordless magic link email via Novu workflow, Resend, or SendGrid.
 * Falls back to server console logging when email keys are not configured.
 */
export async function sendMagicLinkEmail(payload: MagicLinkEmailPayload) {
  const { email, url } = payload;
  const novuKey = process.env.NOVU_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;

  console.log(`[Magic Link] Dispatching sign-in link for ${email}: ${url}`);

  // 1. Try Novu Workflow if configured
  if (novuKey && novuKey !== 'demo-novu-secret-key-2026') {
    try {
      const result = await novu.trigger({
        workflowId: NOVU_WORKFLOWS.magicLinkSignIn,
        to: {
          subscriberId: email,
          email,
        },
        payload: {
          email,
          magicLinkUrl: url,
          signInUrl: url,
        },
      });

      console.log(`[Novu] Magic link email queued for ${email}`);
      return { success: true, result };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Novu error';
      console.warn('[Novu] Failed to send magic link via Novu:', message);
    }
  }

  // 2. Try Resend API if key is present
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'AirBook <auth@getairbook.com>',
          to: [email],
          subject: 'Sign in to AirBook',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #0f172a;">
              <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 12px;">Sign in to AirBook</h2>
              <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">Click the button below to sign in to your AirBook workspace. This passwordless magic link expires in 10 minutes.</p>
              <div style="margin: 28px 0;">
                <a href="${url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 15px;">Sign In to AirBook</a>
              </div>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">If you did not request this link, you can safely ignore this email.</p>
            </div>
          `,
        }),
      });
      if (res.ok) {
        console.log(`[Resend] Magic link email successfully delivered to ${email}`);
        return { success: true, mode: 'resend' };
      } else {
        const errorText = await res.text();
        console.warn(`[Resend] Error sending magic link:`, errorText);
      }
    } catch (e) {
      console.warn(`[Resend] Fetch failed:`, e);
    }
  }

  // 3. Try SendGrid API if key is present
  if (sendgridKey) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email }] }],
          from: { email: process.env.SENDGRID_FROM_EMAIL || 'notifications@getairbook.com', name: 'AirBook' },
          subject: 'Sign in to AirBook',
          content: [
            {
              type: 'text/html',
              value: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #0f172a;">
                  <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 12px;">Sign in to AirBook</h2>
                  <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">Click the button below to sign in to your AirBook workspace. This passwordless magic link expires in 10 minutes.</p>
                  <div style="margin: 28px 0;">
                    <a href="${url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 15px;">Sign In to AirBook</a>
                  </div>
                  <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">If you did not request this link, you can safely ignore this email.</p>
                </div>
              `,
            },
          ],
        }),
      });
      if (res.ok) {
        console.log(`[SendGrid] Magic link email successfully delivered to ${email}`);
        return { success: true, mode: 'sendgrid' };
      } else {
        const errorText = await res.text();
        console.warn(`[SendGrid] Error sending magic link:`, errorText);
      }
    } catch (e) {
      console.warn(`[SendGrid] Fetch failed:`, e);
    }
  }

  // 4. Fallback server logging if no email provider is configured
  console.log(
    `[Magic Link · Fallback] No active email provider responded. Open this link directly:\n${url}`,
  );
  return { success: true, mode: 'dev-console' };
}
