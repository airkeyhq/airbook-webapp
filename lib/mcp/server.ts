import { AIRBOOK_MCP_TOOLS } from "./tools";

export interface JSONRPCRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: any;
}

export interface JSONRPCResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export const AIRBOOK_MCP_METADATA = {
  name: "airbook-mcp-server",
  version: "1.0.0",
  description: "Official AirBook Model Context Protocol (MCP) Server for Salon & Spa Operations",
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
  },
};

/**
 * Handles JSON-RPC 2.0 MCP requests
 */
export async function handleMCPRequest(
  request: JSONRPCRequest,
  context?: { workspaceId?: string }
): Promise<JSONRPCResponse> {
  const { id = null, method, params } = request;

  try {
    switch (method) {
      case "initialize": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            serverInfo: AIRBOOK_MCP_METADATA,
            capabilities: AIRBOOK_MCP_METADATA.capabilities,
          },
        };
      }

      case "notifications/initialized": {
        return {
          jsonrpc: "2.0",
          id,
          result: {},
        };
      }

      case "ping": {
        return {
          jsonrpc: "2.0",
          id,
          result: {},
        };
      }

      case "tools/list": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: AIRBOOK_MCP_TOOLS.map((t) => ({
              name: t.name,
              description: t.description,
              inputSchema: t.inputSchema,
            })),
          },
        };
      }

      case "tools/call": {
        const { name, arguments: args } = params || {};
        const tool = AIRBOOK_MCP_TOOLS.find((t) => t.name === name);

        if (!tool) {
          return {
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Unknown tool: ${name}`,
            },
          };
        }

        const toolResult = await tool.handler(args || {}, context);
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(toolResult, null, 2),
              },
            ],
          },
        };
      }

      case "resources/list": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            resources: [
              {
                uri: "airbook://salon/profile",
                name: "Salon Workspace Profile",
                description: "Metadata, hours, policies, and business config",
                mimeType: "application/json",
              },
              {
                uri: "airbook://salon/services",
                name: "Active Service Menu",
                description: "Catalog of all salon & spa services and prices",
                mimeType: "application/json",
              },
            ],
          },
        };
      }

      case "prompts/list": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            prompts: [
              {
                name: "daily_roster_briefing",
                description: "Generate an executive briefing of today appointments, revenue, and staff schedules",
              },
              {
                name: "reengage_lapsed_clients",
                description: "Draft a high-conversion re-engagement SMS campaign for clients who have not visited in 60 days",
              },
            ],
          },
        };
      }

      default: {
        return {
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
        };
      }
    }
  } catch (error: any) {
    console.error(`[AirBook MCP] Error executing ${method}:`, error);
    return {
      jsonrpc: "2.0",
      id,
      error: {
        code: -32000,
        message: error?.message || "Internal MCP server execution error",
        data: error?.stack,
      },
    };
  }
}
