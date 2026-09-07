import { Novu } from '@novu/api';
import { db } from '@/db';
import { notifications } from '@/db/schema';

const novuSecretKey = process.env.NOVU_SECRET_KEY || 'demo-novu-secret-key-2026';
export const novu = new Novu({ secretKey: novuSecretKey });

export const NOVU_WORKFLOWS = {
  appointmentBooked: process.env.NOVU_APPOINTMENT_WORKFLOW_ID || 'appointment-booked',
  appointmentCancelled: process.env.NOVU_CANCELLATION_WORKFLOW_ID || 'appointment-cancelled',
  magicLinkSignIn: process.env.NOVU_MAGIC_LINK_WORKFLOW_ID || 'magic-link-sign-in',
  teamInvitation: process.env.NOVU_TEAM_INVITATION_WORKFLOW_ID || 'team-invitation',
  smsAlert: process.env.NOVU_SMS_WORKFLOW_ID || 'sms-alert',
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
  workspaceId?: string;
  subscriberId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceName: string;
  staffName: string;
  dateStr: string;
  startTime: string;
  price?: number;
}

export interface CancellationPayload {
  workspaceId?: string;
  subscriberId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceName: string;
  staffName: string;
  dateStr: string;
  startTime: string;
  reason?: string;
}

export interface CustomNotificationPayload {
  workspaceId?: string;
  type: 'sms' | 'email' | 'push' | 'system' | 'payment';
  recipient: string;
  message: string;
  title?: string;
  data?: Record<string, unknown>;
}

export interface CreateNotificationParams {
  workspaceId: string;
  title: string;
  message: string;
  type?: 'sms' | 'email' | 'push' | 'booking' | 'payment' | 'system';
  recipient?: string | null;
  metadata?: Record<string, unknown> | null;
  isRead?: boolean;
}

export async function createWorkspaceNotification(params: CreateNotificationParams) {
  try {
    const [inserted] = await db
      .insert(notifications)
      .values({
        workspaceId: params.workspaceId as any,
        title: params.title,
        message: params.message,
        type: params.type || 'system',
        recipient: params.recipient || null,
        metadata: params.metadata || null,
        isRead: params.isRead ?? false,
      })
      .returning();
    return inserted;
  } catch (error) {
    console.warn('[Notifications] Failed to write DB notification:', error);
    return null;
  }
}

export interface NotificationLogEntry {
  id: string;
  type: 'sms' | 'email' | 'push' | 'system' | 'payment';
  title: string;
  recipient: string;
  message: string;
  status: 'delivered' | 'sent' | 'queued' | 'failed';
  timestamp: string;
}

// Global in-memory buffer of recent notification dispatches
const RECENT_LOGS: NotificationLogEntry[] = [];

export function recordNotificationLog(log: Omit<NotificationLogEntry, 'id' | 'timestamp'> & { timestamp?: string }) {
  const entry: NotificationLogEntry = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: log.timestamp || new Date().toISOString(),
    ...log,
  };
  RECENT_LOGS.unshift(entry);
  if (RECENT_LOGS.length > 100) RECENT_LOGS.pop();
  return entry;
}

export function getRecentNotificationLogs(): NotificationLogEntry[] {
  return [...RECENT_LOGS];
}

/**
 * Triggers unified multi-channel notification via Novu:
 * 1. Push Notification to Service Provider Phone/Desktop lockscreen.
 * 2. Transactional Email to Client with .ics Calendar attachment.
 * 3. Scheduled SMS appointment reminder.
 */
export async function sendBookingNotifications(payload: NotificationPayload) {
  const secretKey = process.env.NOVU_SECRET_KEY;
  const isDemo = !secretKey || secretKey === 'demo-novu-secret-key-2026';

  console.log(`[Novu Engine] Triggering booking notification for ${payload.clientName}...`);

  recordNotificationLog({
    type: payload.clientPhone ? 'sms' : 'email',
    title: `Booking Confirmed: ${payload.serviceName}`,
    recipient: payload.clientEmail || payload.clientPhone || 'Client',
    message: `${payload.serviceName} with ${payload.staffName} on ${payload.dateStr} at ${payload.startTime}.`,
    status: 'sent',
  });

  if (payload.workspaceId) {
    createWorkspaceNotification({
      workspaceId: payload.workspaceId,
      title: `Booking Confirmed: ${payload.serviceName}`,
      message: `${payload.clientName} booked with ${payload.staffName} on ${payload.dateStr} at ${payload.startTime}.`,
      type: 'booking',
      recipient: payload.clientEmail || payload.clientPhone || null,
      metadata: {
        clientName: payload.clientName,
        serviceName: payload.serviceName,
        staffName: payload.staffName,
        dateStr: payload.dateStr,
        startTime: payload.startTime,
        price: payload.price,
      },
    }).catch((err) => console.warn('[Notifications] DB insert error on booking:', err));
  }

  if (isDemo) {
    console.log(`[Novu Dev Mode] Booking notification recorded for ${payload.clientName}`);
    return { success: true, mode: 'demo-fallback' };
  }

  try {
    const result = await novu.trigger({
      workflowId: NOVU_WORKFLOWS.appointmentBooked,
      to: {
        subscriberId: payload.subscriberId || payload.clientEmail || `sub_${Date.now()}`,
        email: payload.clientEmail,
        phone: payload.clientPhone,
      },
      payload: {
        clientName: payload.clientName,
        serviceName: payload.serviceName,
        staffName: payload.staffName,
        dateStr: payload.dateStr,
        startTime: payload.startTime,
        price: payload.price !== undefined ? `$${payload.price}` : '',
      },
    });

    return { success: true, result };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown Novu error';
    console.warn('[Novu Engine] Trigger error:', msg);
    return { success: true, mode: 'fallback-logged', error: msg };
  }
}

/**
 * Triggers appointment cancellation notification via Novu
 */
export async function sendCancellationNotification(payload: CancellationPayload) {
  const secretKey = process.env.NOVU_SECRET_KEY;
  const isDemo = !secretKey || secretKey === 'demo-novu-secret-key-2026';

  console.log(`[Novu Engine] Triggering cancellation alert for ${payload.clientName}...`);

  recordNotificationLog({
    type: payload.clientPhone ? 'sms' : 'email',
    title: `Cancelled: ${payload.serviceName}`,
    recipient: payload.clientEmail || payload.clientPhone || 'Client',
    message: `Appointment for ${payload.serviceName} on ${payload.dateStr} at ${payload.startTime} has been cancelled.`,
    status: 'sent',
  });

  if (payload.workspaceId) {
    createWorkspaceNotification({
      workspaceId: payload.workspaceId,
      title: `Cancelled: ${payload.serviceName}`,
      message: `Appointment for ${payload.clientName} on ${payload.dateStr} at ${payload.startTime} was cancelled.`,
      type: 'booking',
      recipient: payload.clientEmail || payload.clientPhone || null,
      metadata: {
        reason: payload.reason,
        clientName: payload.clientName,
        serviceName: payload.serviceName,
      },
    }).catch((err) => console.warn('[Notifications] DB insert error on cancellation:', err));
  }

  if (isDemo) {
    return { success: true, mode: 'demo-fallback' };
  }

  try {
    const result = await novu.trigger({
      workflowId: NOVU_WORKFLOWS.appointmentCancelled,
      to: {
        subscriberId: payload.subscriberId || payload.clientEmail || `sub_${Date.now()}`,
        email: payload.clientEmail,
        phone: payload.clientPhone,
      },
      payload: {
        clientName: payload.clientName,
        serviceName: payload.serviceName,
        staffName: payload.staffName,
        dateStr: payload.dateStr,
        startTime: payload.startTime,
        reason: payload.reason || 'Requested by salon',
      },
    });

    return { success: true, result };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[Novu Engine] Cancellation trigger error:', msg);
    return { success: true, mode: 'fallback-logged' };
  }
}

/**
 * Dispatches custom SMS, Email, or Push notifications (e.g. Walk-in ready pings, Google Review SMS)
 */
export async function sendCustomNotification(payload: CustomNotificationPayload) {
  const { type, recipient, message, title } = payload;
  const secretKey = process.env.NOVU_SECRET_KEY;
  const isDemo = !secretKey || secretKey === 'demo-novu-secret-key-2026';

  const log = recordNotificationLog({
    type,
    title: title || (type === 'sms' ? 'SMS Notification' : 'Email Notification'),
    recipient,
    message,
    status: 'sent',
  });

  if (payload.workspaceId) {
    createWorkspaceNotification({
      workspaceId: payload.workspaceId,
      title: title || (type === 'sms' ? 'SMS Dispatched' : 'Email Sent'),
      message: `${recipient}: ${message}`,
      type: type || 'sms',
      recipient,
      metadata: payload.data,
    }).catch((err) => console.warn('[Notifications] DB insert error on custom alert:', err));
  }

  if (isDemo) {
    return { success: true, log, mode: 'dev-console' };
  }

  try {
    const result = await novu.trigger({
      workflowId: NOVU_WORKFLOWS.smsAlert,
      to: {
        subscriberId: recipient.replace(/[^a-zA-Z0-9]/g, '_'),
        phone: type === 'sms' ? recipient : undefined,
        email: type === 'email' ? recipient : undefined,
      },
      payload: {
        message,
        title: title || 'AirBook Notification',
        ...payload.data,
      },
    });

    return { success: true, log, result };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[Novu Engine] Custom notification error:', msg);
    return { success: true, log, mode: 'fallback-logged' };
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
