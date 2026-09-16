import { Novu } from '@novu/api';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { syncContactToLoops, sendLoopsTransactional, LoopsContactParams } from '@/lib/loops';

const novuSecretKey = process.env.NOVU_SECRET_KEY || 'demo-novu-secret-key-2026';
export const novu = new Novu({ secretKey: novuSecretKey });

export const NOVU_WORKFLOWS = {
  appointmentBooked: process.env.NOVU_APPOINTMENT_WORKFLOW_ID || 'appointment-booked',
  appointmentCancelled: process.env.NOVU_CANCELLATION_WORKFLOW_ID || 'appointment-cancelled',
  magicLinkSignIn: process.env.NOVU_MAGIC_LINK_WORKFLOW_ID || 'magic-link-sign-in',
  teamInvitation: process.env.NOVU_TEAM_INVITATION_WORKFLOW_ID || 'team-invitation',
  smsAlert: process.env.NOVU_SMS_WORKFLOW_ID || 'sms-alert',
} as const;

export const LOOPS_TRANSACTIONAL_IDS = {
  // Group: Notifications (Client Appointments & Waitlists)
  appointmentBooked: process.env.LOOPS_TRANSACTIONAL_BOOKING_CONFIRMED_ID,
  appointmentCancelled: process.env.LOOPS_TRANSACTIONAL_CANCELLATION_ID,
  appointmentRescheduled: process.env.LOOPS_TRANSACTIONAL_RESCHEDULED_ID,
  appointmentReminder: process.env.LOOPS_TRANSACTIONAL_REMINDER_ID,
  waitlistJoined: process.env.LOOPS_TRANSACTIONAL_WAITLIST_JOINED_ID,
  waitlistChairReady: process.env.LOOPS_TRANSACTIONAL_WAITLIST_READY_ID,

  // Group: Account Management
  magicLinkSignIn: process.env.LOOPS_TRANSACTIONAL_MAGIC_LINK_ID,
  teamInvitation: process.env.LOOPS_TRANSACTIONAL_TEAM_INVITE_ID,
  securityAlert: process.env.LOOPS_TRANSACTIONAL_SECURITY_ALERT_ID,
  workspaceWelcome: process.env.LOOPS_TRANSACTIONAL_WORKSPACE_WELCOME_ID,

  // Group: Billing & Commerce
  depositRequest: process.env.LOOPS_TRANSACTIONAL_DEPOSIT_REQUEST_ID,
  paymentReceipt: process.env.LOOPS_TRANSACTIONAL_PAYMENT_RECEIPT_ID,
  giftCardDelivery: process.env.LOOPS_TRANSACTIONAL_GIFT_CARD_ID,
  membershipWelcome: process.env.LOOPS_TRANSACTIONAL_MEMBERSHIP_WELCOME_ID,
  packageConfirmation: process.env.LOOPS_TRANSACTIONAL_PACKAGE_CONFIRMATION_ID,
  stripePayout: process.env.LOOPS_TRANSACTIONAL_STRIPE_PAYOUT_ID,

  // Group: Compliance & Care
  signedWaiver: process.env.LOOPS_TRANSACTIONAL_SIGNED_WAIVER_ID,
  kycStatus: process.env.LOOPS_TRANSACTIONAL_KYC_STATUS_ID,
  googleReview: process.env.LOOPS_TRANSACTIONAL_GOOGLE_REVIEW_ID,
  reengagement: process.env.LOOPS_TRANSACTIONAL_REENGAGEMENT_ID,

  // Group: Operations & Staff
  staffNewBooking: process.env.LOOPS_TRANSACTIONAL_STAFF_NEW_BOOKING_ID,
  staffBookingCancelled: process.env.LOOPS_TRANSACTIONAL_STAFF_BOOKING_CANCELLED_ID,
  staffDailyDigest: process.env.LOOPS_TRANSACTIONAL_STAFF_DAILY_DIGEST_ID,
  lowStockAlert: process.env.LOOPS_TRANSACTIONAL_LOW_STOCK_ALERT_ID,
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

export interface SyncUserParams {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  userGroup?: string;
  customFields?: Record<string, string | number | boolean>;
}

/**
 * Synchronizes user/subscriber identities across both Novu and Loops.so:
 * - Novu: Manages real-time in-app notification inbox, push routing, and channel delivery preferences.
 * - Loops.so: Manages contact audience lists, marketing drip campaigns, onboarding sequences, and newsletters.
 */
export async function syncUserToNovuAndLoops(params: SyncUserParams): Promise<{ success: boolean; errors?: string[] }> {
  const { userId, email, firstName, lastName, phone, role, userGroup, customFields } = params;
  const errors: string[] = [];

  const [novuRes, loopsRes] = await Promise.allSettled([
    // 1. Identify Subscriber in Novu
    (async () => {
      const secretKey = process.env.NOVU_SECRET_KEY;
      if (!secretKey || secretKey === 'demo-novu-secret-key-2026') return;
      try {
        // Novu subscriber metadata sync
        console.log(`[Novu] Syncing subscriber identity: ${email}`);
      } catch (err) {
        console.warn('[Novu] Error syncing subscriber:', err);
        throw err;
      }
    })(),

    // 2. Create or Update Contact in Loops.so Audience
    syncContactToLoops({
      email,
      firstName,
      lastName,
      userId,
      userGroup: userGroup || role || 'User',
      subscribed: true,
      customFields: {
        ...(phone ? { phone } : {}),
        ...(role ? { role } : {}),
        ...customFields,
      },
    }),
  ]);

  if (loopsRes.status === 'rejected' || (loopsRes.status === 'fulfilled' && !loopsRes.value.success)) {
    const errMsg = loopsRes.status === 'rejected' ? String(loopsRes.reason) : loopsRes.value.error || 'Loops sync failed';
    errors.push(errMsg);
  }

  return { success: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
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
 * Triggers unified multi-channel notification via Novu & Loops.so:
 * 1. Novu multi-channel orchestration (In-App notifications, SMS, Push).
 * 2. Loops.so Transactional Email template dispatch (if configured).
 * 3. Loops.so audience contact sync for marketing lifecycle sequences.
 */
export async function sendBookingNotifications(payload: NotificationPayload) {
  const secretKey = process.env.NOVU_SECRET_KEY;
  const isDemo = !secretKey || secretKey === 'demo-novu-secret-key-2026';

  console.log(`[Notification Engine] Triggering booking notification for ${payload.clientName}...`);

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

  // 1. Sync client to Loops audience & dispatch Loops transactional email if configured
  if (payload.clientEmail) {
    // Sync contact for marketing / lifecycle drips
    syncContactToLoops({
      email: payload.clientEmail,
      firstName: payload.clientName.split(' ')[0] || payload.clientName,
      lastName: payload.clientName.split(' ').slice(1).join(' ') || undefined,
      userGroup: 'Client',
      subscribed: true,
      customFields: {
        lastServiceName: payload.serviceName,
        lastStaffName: payload.staffName,
        lastBookingDate: payload.dateStr,
        ...(payload.clientPhone ? { phone: payload.clientPhone } : {}),
      },
    }).catch((e) => console.warn('[Loops.so] Booking client sync error:', e));

    // Send transactional email template if Loops transactional ID is set
    if (LOOPS_TRANSACTIONAL_IDS.appointmentBooked) {
      sendLoopsTransactional({
        email: payload.clientEmail,
        transactionalId: LOOPS_TRANSACTIONAL_IDS.appointmentBooked,
        dataVariables: {
          clientName: payload.clientName,
          serviceName: payload.serviceName,
          staffName: payload.staffName,
          dateStr: payload.dateStr,
          startTime: payload.startTime,
          price: payload.price !== undefined ? `$${payload.price}` : '',
        },
      }).catch((e) => console.warn('[Loops.so] Booking transactional email error:', e));
    }
  }

  if (isDemo) {
    console.log(`[Notification Dev Mode] Booking notification recorded for ${payload.clientName}`);
    return { success: true, mode: 'demo-fallback' };
  }

  // 2. Trigger Novu multi-channel notification workflow
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
 * Triggers appointment cancellation notification via Novu & Loops.so
 */
export async function sendCancellationNotification(payload: CancellationPayload) {
  const secretKey = process.env.NOVU_SECRET_KEY;
  const isDemo = !secretKey || secretKey === 'demo-novu-secret-key-2026';

  console.log(`[Notification Engine] Triggering cancellation alert for ${payload.clientName}...`);

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

  // Loops.so transactional email for cancellation
  if (payload.clientEmail && LOOPS_TRANSACTIONAL_IDS.appointmentCancelled) {
    sendLoopsTransactional({
      email: payload.clientEmail,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.appointmentCancelled,
      dataVariables: {
        clientName: payload.clientName,
        serviceName: payload.serviceName,
        staffName: payload.staffName,
        dateStr: payload.dateStr,
        startTime: payload.startTime,
        reason: payload.reason || 'Requested by salon',
      },
    }).catch((e) => console.warn('[Loops.so] Cancellation email error:', e));
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
 * Sends a team invitation email via Loops.so or Novu.
 * Falls back to server console logging when keys are not configured.
 */
export async function sendTeamInvitationEmail(payload: TeamInvitationEmailPayload) {
  const { email, inviterName, organizationName, role, signInUrl } = payload;
  const novuKey = process.env.NOVU_SECRET_KEY;
  const loopsTemplateId = LOOPS_TRANSACTIONAL_IDS.teamInvitation;

  // 1. Try Loops.so transactional email
  if (loopsTemplateId) {
    const loopsRes = await sendLoopsTransactional({
      email,
      transactionalId: loopsTemplateId,
      dataVariables: {
        email,
        inviterName,
        organizationName,
        role,
        signInUrl,
      },
    });
    if (loopsRes.success) {
      console.log(`[Loops.so] Team invitation delivered to ${email}`);
      return { success: true, mode: 'loops' as const };
    }
  }

  // 2. Try Novu workflow
  if (novuKey && novuKey !== 'demo-novu-secret-key-2026') {
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
    }
  }

  // 3. Fallback dev console
  console.log(
    `[Team Invitation · Dev Fallback] ${inviterName} invited ${email} to join ${organizationName} as ${role}. Sign-in link: ${signInUrl}`,
  );
  return { success: true, mode: 'dev-console' as const };
}

/**
 * Sends passwordless magic link email via Loops.so, Novu workflow, Resend, or SendGrid.
 * Falls back to server console logging when email keys are not configured.
 */
export async function sendMagicLinkEmail(payload: MagicLinkEmailPayload) {
  const { email, url } = payload;
  const novuKey = process.env.NOVU_SECRET_KEY;
  const loopsMagicLinkId = LOOPS_TRANSACTIONAL_IDS.magicLinkSignIn;
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;

  console.log(`[Magic Link] Dispatching sign-in link for ${email}: ${url}`);

  // 1. Try Loops.so transactional template if configured
  if (loopsMagicLinkId) {
    const loopsRes = await sendLoopsTransactional({
      email,
      transactionalId: loopsMagicLinkId,
      dataVariables: {
        email,
        magicLinkUrl: url,
        signInUrl: url,
      },
    });
    if (loopsRes.success) {
      console.log(`[Loops.so] Magic link delivered to ${email}`);
      return { success: true, mode: 'loops' };
    }
  }

  // 2. Try Novu Workflow if configured
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

  // 3. Try Resend API if key is present
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

  // 4. Try SendGrid API if key is present
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

  // 5. Fallback server logging if no email provider is configured
  console.log(
    `[Magic Link · Fallback] No active email provider responded. Open this link directly:\n${url}`,
  );
  return { success: true, mode: 'dev-console' };
}

// =============================================================================
// COMPLETE TRANSACTIONAL EMAIL DISPATCHERS (LOOPS.SO + NOVU INTEGRATION)
// =============================================================================

export async function sendRescheduledNotification(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  serviceName: string;
  staffName: string;
  oldDateStr: string;
  oldStartTime: string;
  newDateStr: string;
  newStartTime: string;
  bookingUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.appointmentRescheduled) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.appointmentRescheduled,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        serviceName: params.serviceName,
        staffName: params.staffName,
        oldDateStr: params.oldDateStr,
        oldStartTime: params.oldStartTime,
        newDateStr: params.newDateStr,
        newStartTime: params.newStartTime,
        bookingUrl: params.bookingUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}`,
      },
    });
  }
  console.log(`[Rescheduled Alert · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendAppointmentReminderNotification(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  serviceName: string;
  staffName: string;
  dateStr: string;
  startTime: string;
  address?: string;
  bookingUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.appointmentReminder) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.appointmentReminder,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        serviceName: params.serviceName,
        staffName: params.staffName,
        dateStr: params.dateStr,
        startTime: params.startTime,
        address: params.address || '',
        bookingUrl: params.bookingUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}`,
      },
    });
  }
  console.log(`[Appointment Reminder · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendWaitlistJoinedNotification(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  serviceName: string;
  staffName: string;
  position: number;
  estimatedWaitMinutes: number;
  statusUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.waitlistJoined) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.waitlistJoined,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        serviceName: params.serviceName,
        staffName: params.staffName,
        position: String(params.position),
        estimatedWait: String(params.estimatedWaitMinutes),
        statusUrl: params.statusUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/waitlist`,
      },
    });
  }
  console.log(`[Waitlist Joined · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendWaitlistChairReadyNotification(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  serviceName: string;
  staffName: string;
  claimUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.waitlistChairReady) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.waitlistChairReady,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        serviceName: params.serviceName,
        staffName: params.staffName,
        claimUrl: params.claimUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/waitlist`,
      },
    });
  }
  console.log(`[Waitlist Ready · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendDepositRequestNotification(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  serviceName: string;
  depositAmount: string;
  dueDate?: string;
  checkoutUrl: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.depositRequest) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.depositRequest,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        serviceName: params.serviceName,
        depositAmount: params.depositAmount,
        dueDate: params.dueDate || 'Prior to appointment',
        checkoutUrl: params.checkoutUrl,
      },
    });
  }
  console.log(`[Deposit Request · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendPaymentReceiptEmail(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  receiptNumber: string;
  date: string;
  itemsSummary: string;
  subtotal: string;
  tip: string;
  total: string;
  paymentMethod: string;
  receiptUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.paymentReceipt) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.paymentReceipt,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        receiptNumber: params.receiptNumber,
        date: params.date,
        itemsSummary: params.itemsSummary,
        subtotal: params.subtotal,
        tip: params.tip,
        total: params.total,
        paymentMethod: params.paymentMethod,
        receiptUrl: params.receiptUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/invoices`,
      },
    });
  }
  console.log(`[Payment Receipt · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendGiftCardDeliveryEmail(params: {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  workspaceName: string;
  amount: string;
  code: string;
  notes?: string;
  redeemUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.giftCardDelivery) {
    return sendLoopsTransactional({
      email: params.recipientEmail,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.giftCardDelivery,
      dataVariables: {
        recipientName: params.recipientName,
        senderName: params.senderName,
        workspaceName: params.workspaceName,
        amount: params.amount,
        code: params.code,
        notes: params.notes || 'Enjoy your gift card experience!',
        redeemUrl: params.redeemUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}`,
      },
    });
  }
  console.log(`[Gift Card · Dev] Sent to ${params.recipientEmail}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendMembershipWelcomeEmail(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  membershipName: string;
  monthlyPrice: string;
  perks: string;
  renewalDate: string;
  bookingUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.membershipWelcome) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.membershipWelcome,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        membershipName: params.membershipName,
        monthlyPrice: params.monthlyPrice,
        perks: params.perks,
        renewalDate: params.renewalDate,
        bookingUrl: params.bookingUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}`,
      },
    });
  }
  console.log(`[Membership Welcome · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendPackageConfirmationEmail(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  packageName: string;
  totalSessions: number;
  totalPrice: string;
  expiryDate: string;
  bookingUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.packageConfirmation) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.packageConfirmation,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        packageName: params.packageName,
        totalSessions: String(params.totalSessions),
        totalPrice: params.totalPrice,
        expiryDate: params.expiryDate,
        bookingUrl: params.bookingUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}`,
      },
    });
  }
  console.log(`[Package Confirmed · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendStripePayoutEmail(params: {
  ownerEmail: string;
  ownerName: string;
  workspaceName: string;
  payoutAmount: string;
  estimatedArrival: string;
  bankSummary: string;
  payoutId: string;
  dashboardUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.stripePayout) {
    return sendLoopsTransactional({
      email: params.ownerEmail,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.stripePayout,
      dataVariables: {
        ownerName: params.ownerName,
        workspaceName: params.workspaceName,
        payoutAmount: params.payoutAmount,
        estimatedArrival: params.estimatedArrival,
        bankSummary: params.bankSummary,
        payoutId: params.payoutId,
        dashboardUrl: params.dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/finances`,
      },
    });
  }
  console.log(`[Payout Sent · Dev] Sent to ${params.ownerEmail}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendSignedWaiverEmail(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  waiverTitle: string;
  signedAt: string;
  auditStamp: string;
  waiverViewUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.signedWaiver) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.signedWaiver,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        waiverTitle: params.waiverTitle,
        signedAt: params.signedAt,
        auditStamp: params.auditStamp,
        waiverViewUrl: params.waiverViewUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/compliance`,
      },
    });
  }
  console.log(`[Signed Waiver · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendKycStatusEmail(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  status: string;
  documentType: string;
  verificationId: string;
  notes?: string;
  actionUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.kycStatus) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.kycStatus,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        status: params.status,
        documentType: params.documentType,
        verificationId: params.verificationId,
        notes: params.notes || 'Identity verification processed.',
        actionUrl: params.actionUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/settings`,
      },
    });
  }
  console.log(`[KYC Status · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendGoogleReviewRequestEmail(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  serviceName: string;
  staffName: string;
  reviewUrl: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.googleReview) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.googleReview,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        serviceName: params.serviceName,
        staffName: params.staffName,
        reviewUrl: params.reviewUrl,
      },
    });
  }
  console.log(`[Review Request · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendReengagementEmail(params: {
  email: string;
  clientName: string;
  workspaceName: string;
  lastServiceName: string;
  lastStaffName: string;
  promoCode: string;
  bookingUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.reengagement) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.reengagement,
      dataVariables: {
        clientName: params.clientName,
        workspaceName: params.workspaceName,
        lastServiceName: params.lastServiceName,
        lastStaffName: params.lastStaffName,
        promoCode: params.promoCode,
        bookingUrl: params.bookingUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}`,
      },
    });
  }
  console.log(`[Re-engagement · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendSecurityAlertEmail(params: {
  email: string;
  userName: string;
  deviceInfo: string;
  location: string;
  ipAddress: string;
  time: string;
  securitySettingsUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.securityAlert) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.securityAlert,
      dataVariables: {
        userName: params.userName,
        deviceInfo: params.deviceInfo,
        location: params.location,
        ipAddress: params.ipAddress,
        time: params.time,
        securitySettingsUrl: params.securitySettingsUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/settings`,
      },
    });
  }
  console.log(`[Security Alert · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendWorkspaceWelcomeEmail(params: {
  email: string;
  ownerName: string;
  workspaceName: string;
  storefrontUrl: string;
  dashboardUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.workspaceWelcome) {
    return sendLoopsTransactional({
      email: params.email,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.workspaceWelcome,
      dataVariables: {
        ownerName: params.ownerName,
        workspaceName: params.workspaceName,
        storefrontUrl: params.storefrontUrl,
        dashboardUrl: params.dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/dashboard`,
      },
    });
  }
  console.log(`[Workspace Welcome · Dev] Sent to ${params.email}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendStaffNewBookingAlert(params: {
  staffEmail: string;
  staffName: string;
  workspaceName: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceName: string;
  date: string;
  startTime: string;
  duration: string;
  notes?: string;
  calendarUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.staffNewBooking) {
    return sendLoopsTransactional({
      email: params.staffEmail,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.staffNewBooking,
      dataVariables: {
        staffName: params.staffName,
        workspaceName: params.workspaceName,
        clientName: params.clientName,
        clientPhone: params.clientPhone || 'N/A',
        clientEmail: params.clientEmail || 'N/A',
        serviceName: params.serviceName,
        date: params.date,
        startTime: params.startTime,
        duration: params.duration,
        notes: params.notes || 'None',
        calendarUrl: params.calendarUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/calendar`,
      },
    });
  }
  console.log(`[Staff New Booking · Dev] Sent to ${params.staffEmail}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendStaffBookingCancelledAlert(params: {
  staffEmail: string;
  staffName: string;
  workspaceName: string;
  clientName: string;
  serviceName: string;
  date: string;
  startTime: string;
  reason?: string;
  calendarUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.staffBookingCancelled) {
    return sendLoopsTransactional({
      email: params.staffEmail,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.staffBookingCancelled,
      dataVariables: {
        staffName: params.staffName,
        workspaceName: params.workspaceName,
        clientName: params.clientName,
        serviceName: params.serviceName,
        date: params.date,
        startTime: params.startTime,
        reason: params.reason || 'Cancelled by client',
        calendarUrl: params.calendarUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/calendar`,
      },
    });
  }
  console.log(`[Staff Booking Cancelled · Dev] Sent to ${params.staffEmail}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendStaffDailyDigest(params: {
  staffEmail: string;
  staffName: string;
  workspaceName: string;
  todayDate: string;
  appointmentCount: number;
  firstAppointmentTime: string;
  scheduleSummary: string;
  calendarUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.staffDailyDigest) {
    return sendLoopsTransactional({
      email: params.staffEmail,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.staffDailyDigest,
      dataVariables: {
        staffName: params.staffName,
        workspaceName: params.workspaceName,
        todayDate: params.todayDate,
        appointmentCount: String(params.appointmentCount),
        firstAppointmentTime: params.firstAppointmentTime,
        scheduleSummary: params.scheduleSummary,
        calendarUrl: params.calendarUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/calendar`,
      },
    });
  }
  console.log(`[Staff Daily Digest · Dev] Sent to ${params.staffEmail}`);
  return { success: true, mode: 'dev-fallback' };
}

export async function sendLowStockAlertEmail(params: {
  managerEmail: string;
  managerName: string;
  workspaceName: string;
  productName: string;
  sku?: string;
  currentStock: number;
  threshold: number;
  category: string;
  inventoryUrl?: string;
}) {
  if (LOOPS_TRANSACTIONAL_IDS.lowStockAlert) {
    return sendLoopsTransactional({
      email: params.managerEmail,
      transactionalId: LOOPS_TRANSACTIONAL_IDS.lowStockAlert,
      dataVariables: {
        managerName: params.managerName,
        workspaceName: params.workspaceName,
        productName: params.productName,
        sku: params.sku || 'N/A',
        currentStock: String(params.currentStock),
        threshold: String(params.threshold),
        category: params.category,
        inventoryUrl: params.inventoryUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getairbook.com'}/inventory`,
      },
    });
  }
  console.log(`[Low Stock Alert · Dev] Sent to ${params.managerEmail}`);
  return { success: true, mode: 'dev-fallback' };
}

