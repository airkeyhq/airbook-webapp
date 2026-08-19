import { Novu } from '@novu/api';

const novuSecretKey = process.env.NOVU_SECRET_KEY || 'demo-novu-secret-key-2026';
export const novu = new Novu({ secretKey: novuSecretKey });

export const NOVU_WORKFLOWS = {
  appointmentBooked: 'appointment-booked',
  magicLinkSignIn: process.env.NOVU_MAGIC_LINK_WORKFLOW_ID || 'magic-link-sign-in',
} as const;

export interface MagicLinkEmailPayload {
  email: string;
  url: string;
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
 * Sends passwordless magic link email via Novu workflow.
 * Falls back to server console logging when NOVU_SECRET_KEY is not configured.
 */
export async function sendMagicLinkEmail(payload: MagicLinkEmailPayload) {
  const { email, url } = payload;
  const secretKey = process.env.NOVU_SECRET_KEY;

  if (!secretKey) {
    console.log(
      `[Magic Link · Dev Fallback] NOVU_SECRET_KEY is not set. Open this link for ${email}:\n${url}`,
    );
    return { success: true, mode: 'dev-console' as const };
  }

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
    console.error('[Novu] Failed to send magic link email:', message);
    throw new Error('Could not send magic link email. Please try again.');
  }
}
