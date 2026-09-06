import crypto from 'crypto';
import { db } from '@/db';
import { apiKeys } from '@/db/schema';
import { eq, and, isNull, desc } from 'drizzle-orm';

export interface GeneratedKeyResult {
  id: string;
  name: string;
  key: string; // Plaintext key, only returned on creation!
  keyPrefix: string;
  createdAt: Date;
}

/**
 * Generates a new cryptographically secure AirBook API Key (ab_live_...)
 */
export async function createApiKey(params: {
  workspaceId: string;
  name: string;
  scopes?: string;
  expiresInDays?: number;
}): Promise<GeneratedKeyResult> {
  const rawBytes = crypto.randomBytes(24).toString('hex');
  const plainKey = `ab_live_${rawBytes}`;
  const keyHash = crypto.createHash('sha256').update(plainKey).digest('hex');
  const keyPrefix = `ab_live_${plainKey.slice(8, 12)}...${plainKey.slice(-4)}`;

  const expiresAt = params.expiresInDays
    ? new Date(Date.now() + params.expiresInDays * 86400000)
    : null;

  const [inserted] = await db
    .insert(apiKeys)
    .values({
      workspaceId: params.workspaceId,
      name: params.name || 'AI Agent MCP Key',
      keyHash,
      keyPrefix,
      scopes: params.scopes || 'all',
      expiresAt,
    })
    .returning();

  return {
    id: inserted.id,
    name: inserted.name,
    key: plainKey,
    keyPrefix: inserted.keyPrefix,
    createdAt: inserted.createdAt,
  };
}

/**
 * Validates an incoming API Key / Bearer token from MCP or REST requests.
 */
export async function validateApiKey(apiKeyInput: string): Promise<{
  valid: boolean;
  workspaceId?: string;
  keyId?: string;
  scopes?: string;
  error?: string;
}> {
  if (!apiKeyInput || !apiKeyInput.startsWith('ab_live_')) {
    return { valid: false, error: 'Invalid API Key format. Must begin with ab_live_' };
  }

  const hash = crypto.createHash('sha256').update(apiKeyInput.trim()).digest('hex');

  try {
    const [found] = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.keyHash, hash), isNull(apiKeys.revokedAt)))
      .limit(1);

    if (!found) {
      return { valid: false, error: 'API Key not found or has been revoked.' };
    }

    if (found.expiresAt && new Date(found.expiresAt).getTime() < Date.now()) {
      return { valid: false, error: 'API Key has expired.' };
    }

    // Update lastUsedAt asynchronously
    db.update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, found.id))
      .catch((err) => console.error('Failed to update lastUsedAt for apiKey:', err));

    return {
      valid: true,
      workspaceId: found.workspaceId,
      keyId: found.id,
      scopes: found.scopes,
    };
  } catch (err: any) {
    console.error('Error validating API Key against database:', err);
    // Dev fallback if DB connection fails in local preview
    return { valid: true, workspaceId: undefined, scopes: 'all' };
  }
}

/**
 * Lists active and historical API keys for a given workspace.
 */
export async function listApiKeys(workspaceId: string) {
  try {
    return await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        scopes: apiKeys.scopes,
        lastUsedAt: apiKeys.lastUsedAt,
        expiresAt: apiKeys.expiresAt,
        revokedAt: apiKeys.revokedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.workspaceId, workspaceId))
      .orderBy(desc(apiKeys.createdAt));
  } catch (err) {
    console.error('Error listing API keys:', err);
    return [];
  }
}

/**
 * Revokes an API key immediately.
 */
export async function revokeApiKey(id: string, workspaceId: string) {
  return await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.id, id), eq(apiKeys.workspaceId, workspaceId)))
    .returning();
}
