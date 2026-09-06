import { NextResponse } from 'next/server';
import { createApiKey, listApiKeys, revokeApiKey } from '@/lib/api-keys';
import { db } from '@/db';
import { workspaces } from '@/db/schema';

export const dynamic = 'force-dynamic';

async function getDefaultWorkspaceId(): Promise<string> {
  try {
    const [ws] = await db.select({ id: workspaces.id }).from(workspaces).limit(1);
    return ws?.id || '00000000-0000-0000-0000-000000000000';
  } catch {
    return '00000000-0000-0000-0000-000000000000';
  }
}

/**
 * GET /api/api-keys
 * Lists all active and historical API keys for the workspace.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId') || (await getDefaultWorkspaceId());

    const keys = await listApiKeys(workspaceId);
    return NextResponse.json({ success: true, keys });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch API keys.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/api-keys
 * Creates a new secret AirBook API key and returns plaintext key once.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const workspaceId = body.workspaceId || (await getDefaultWorkspaceId());
    const name = (body.name || 'AI Agent MCP Key').trim();
    const scopes = body.scopes || 'all';
    const expiresInDays = body.expiresInDays ? parseInt(body.expiresInDays, 10) : undefined;

    if (!name) {
      return NextResponse.json({ error: 'Key name is required.' }, { status: 400 });
    }

    const created = await createApiKey({
      workspaceId,
      name,
      scopes,
      expiresInDays,
    });

    return NextResponse.json({
      success: true,
      apiKey: created,
      warning: 'Make sure to copy your Secret API Key now. You will not be able to view it again!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create API key.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/api-keys
 * Revokes an existing API key.
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, workspaceId } = body;

    if (!id) {
      return NextResponse.json({ error: 'API Key ID is required.' }, { status: 400 });
    }

    const wsId = workspaceId || (await getDefaultWorkspaceId());
    await revokeApiKey(id, wsId);

    return NextResponse.json({ success: true, message: 'API Key revoked successfully.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to revoke API key.' },
      { status: 500 }
    );
  }
}
