import { NextResponse } from 'next/server';
import { handleMCPRequest, AIRBOOK_MCP_METADATA } from '@/lib/mcp/server';
import { AIRBOOK_MCP_TOOLS } from '@/lib/mcp/tools';
import { validateApiKey } from '@/lib/api-keys';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key, X-Workspace-Id',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

function extractApiKey(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  const xApiKey = req.headers.get('x-api-key');
  if (xApiKey) return xApiKey.trim();

  const url = new URL(req.url);
  const queryKey = url.searchParams.get('api_key') || url.searchParams.get('key');
  if (queryKey) return queryKey.trim();

  return null;
}

/**
 * GET /api/mcp
 * Discovers AirBook MCP Server capabilities, metadata, and available tools.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format');

  if (format === 'sse') {
    // SSE Streamable handshake for MCP clients requiring SSE
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      await writer.write(
        encoder.encode(`event: endpoint\ndata: /api/mcp\n\n`)
      );
    })();

    return new Response(responseStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...CORS_HEADERS,
      },
    });
  }

  return NextResponse.json(
    {
      status: 'online',
      server: AIRBOOK_MCP_METADATA,
      endpoint: '/api/mcp',
      supportedTransport: ['http-post', 'sse'],
      toolsCount: AIRBOOK_MCP_TOOLS.length,
      tools: AIRBOOK_MCP_TOOLS.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
      auth: {
        type: 'Bearer API Key',
        header: 'Authorization: Bearer ab_live_...',
        helpUrl: 'https://getairbook.com/help#ai-mcp-integration',
      },
      documentation: 'https://getairbook.com/llms.txt',
    },
    { headers: CORS_HEADERS }
  );
}

/**
 * POST /api/mcp
 * Executes standard Model Context Protocol (MCP) JSON-RPC 2.0 requests with API Key security.
 */
export async function POST(req: Request) {
  try {
    const rawApiKey = extractApiKey(req);
    let resolvedWorkspaceId = req.headers.get('x-workspace-id') || undefined;

    if (rawApiKey) {
      const auth = await validateApiKey(rawApiKey);
      if (!auth.valid) {
        return NextResponse.json(
          {
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32001,
              message: auth.error || 'Unauthorized: Invalid or revoked AirBook API key.',
            },
          },
          { status: 401, headers: CORS_HEADERS }
        );
      }
      if (auth.workspaceId) {
        resolvedWorkspaceId = auth.workspaceId;
      }
    }

    const body = await req.json();

    // Handle batch JSON-RPC requests
    if (Array.isArray(body)) {
      const responses = await Promise.all(
        body.map((item) => handleMCPRequest(item, { workspaceId: resolvedWorkspaceId }))
      );
      return NextResponse.json(responses, { headers: CORS_HEADERS });
    }

    // Handle single JSON-RPC request
    const response = await handleMCPRequest(body, { workspaceId: resolvedWorkspaceId });
    return NextResponse.json(response, { headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: error?.message || 'Parse error / Invalid JSON',
        },
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

