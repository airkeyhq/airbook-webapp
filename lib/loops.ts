/**
 * Loops.so Client & Integration Utilities
 * Supports marketing audience contact sync, custom product events, and transactional email dispatch.
 */

export interface LoopsContactParams {
  email: string;
  firstName?: string;
  lastName?: string;
  userId?: string;
  userGroup?: string;
  subscribed?: boolean;
  source?: string;
  customFields?: Record<string, string | number | boolean>;
}

export interface LoopsTransactionalParams {
  email: string;
  transactionalId: string;
  dataVariables?: Record<string, string | number | boolean | undefined>;
  addToAudience?: boolean;
  attachments?: Array<{
    filename: string;
    contentType: string;
    data: string; // Base64 encoded string
  }>;
}

export interface LoopsEventParams {
  email: string;
  eventName: string;
  userId?: string;
  eventProperties?: Record<string, string | number | boolean>;
}

const LOOPS_API_BASE = 'https://app.loops.so/api/v1';

/**
 * Creates or updates a contact in Loops.so audience.
 * Used for marketing drip campaigns, onboarding sequences, and subscriber lists.
 */
export async function syncContactToLoops(params: LoopsContactParams): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const apiKey = process.env.LOOPS_API_KEY;
  const { email, firstName, lastName, userId, userGroup, subscribed = true, source = 'AirBook', customFields } = params;

  if (!apiKey) {
    console.log(`[Loops.so · Dev Mode] Contact sync skipped (no LOOPS_API_KEY): ${email} (${firstName || ''} ${lastName || ''})`);
    return { success: true, data: { mode: 'dev-fallback' } };
  }

  try {
    const payload: Record<string, unknown> = {
      email,
      firstName,
      lastName,
      userId,
      userGroup,
      subscribed,
      source,
      ...customFields,
    };

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });

    // Try creating contact, or update if exists
    const response = await fetch(`${LOOPS_API_BASE}/contacts/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[Loops.so] Contact created: ${email}`);
      return { success: true, data };
    }

    // If contact already exists (HTTP 409 or specific error), update instead
    if (response.status === 409 || response.status === 400) {
      const updateResponse = await fetch(`${LOOPS_API_BASE}/contacts/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (updateResponse.ok) {
        const data = await updateResponse.json();
        console.log(`[Loops.so] Contact updated: ${email}`);
        return { success: true, data };
      }

      const updateErr = await updateResponse.text();
      console.warn(`[Loops.so] Failed to update contact ${email}:`, updateErr);
      return { success: false, error: updateErr };
    }

    const errText = await response.text();
    console.warn(`[Loops.so] Failed to create contact ${email}:`, errText);
    return { success: false, error: errText };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown Loops error';
    console.warn(`[Loops.so] Exception syncing contact ${email}:`, message);
    return { success: false, error: message };
  }
}

/**
 * Sends a transactional email using a pre-designed template in Loops.so.
 */
export async function sendLoopsTransactional(
  params: LoopsTransactionalParams
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const apiKey = process.env.LOOPS_API_KEY;
  const { email, transactionalId, dataVariables, addToAudience = true, attachments } = params;

  if (!apiKey) {
    console.log(
      `[Loops.so · Dev Mode] Transactional email (${transactionalId}) to ${email} logged. Variables:`,
      dataVariables
    );
    return { success: true, data: { mode: 'dev-fallback' } };
  }

  try {
    const payload: Record<string, unknown> = {
      email,
      transactionalId,
      addToAudience,
    };

    if (dataVariables) {
      payload.dataVariables = dataVariables;
    }

    if (attachments && attachments.length > 0) {
      payload.attachments = attachments;
    }

    const response = await fetch(`${LOOPS_API_BASE}/transactional`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[Loops.so] Transactional send failed (${response.status}):`, errText);
      return { success: false, error: errText };
    }

    const data = await response.json();
    console.log(`[Loops.so] Transactional email (${transactionalId}) sent to ${email}`);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown Loops error';
    console.warn(`[Loops.so] Exception sending transactional email:`, message);
    return { success: false, error: message };
  }
}

/**
 * Sends a custom event to Loops.so to trigger an automated marketing journey or drip sequence.
 */
export async function sendLoopsEvent(
  params: LoopsEventParams
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const apiKey = process.env.LOOPS_API_KEY;
  const { email, eventName, userId, eventProperties } = params;

  if (!apiKey) {
    console.log(`[Loops.so · Dev Mode] Event '${eventName}' logged for ${email}`);
    return { success: true, data: { mode: 'dev-fallback' } };
  }

  try {
    const response = await fetch(`${LOOPS_API_BASE}/events/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        eventName,
        userId,
        eventProperties,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[Loops.so] Failed to send event ${eventName}:`, errText);
      return { success: false, error: errText };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown Loops error';
    console.warn(`[Loops.so] Exception sending event ${eventName}:`, message);
    return { success: false, error: message };
  }
}
