interface WebMCPTool {
  name: string;
  title?: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

interface WebMCPModelContext {
  registerTool(
    tool: {
      name: string;
      title?: string;
      description: string;
      inputSchema: Record<string, unknown>;
      execute: (
        input?: Record<string, unknown>
      ) => Promise<unknown> | unknown;
    },
    options?: {
      signal?: AbortSignal;
    }
  ): Promise<void>;

  getTools(): Promise<WebMCPTool[]>;

  executeTool(
    tool: WebMCPTool,
    input?: Record<string, unknown>
  ): Promise<unknown>;
}

interface Document {
  modelContext: WebMCPModelContext;
}

interface Window {
  __agentspace_webmcp_controller__?: AbortController;
}
