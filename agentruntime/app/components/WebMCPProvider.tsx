"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_CAPABILITIES,
  Capability,
  CapabilityExecutionResult,
} from "@/lib/agentspace/capabilities";

export interface Activity {
  id: string;
  capabilityName: string;
  status: "pending" | "success" | "error";
  timestamp: string;
  input?: Record<string, unknown>;
  result?: CapabilityExecutionResult;
}

const WEBMCP_TOOLS = [
  "get_project_capabilities",
  "get_environment",
  "find_component",
  "create_component",
  "run_tests",
  "build_project",
] as const;

const componentStore = [
  "Button.tsx",
  "Card.tsx",
  "PricingCard.tsx",
  "Navbar.tsx",
];

function emitActivity(activity: Activity) {
  window.dispatchEvent(
    new CustomEvent<Activity>("agentspace:activity", {
      detail: activity,
    })
  );
}

function activity(
  capabilityName: string,
  status: Activity["status"],
  input?: Record<string, unknown>,
  result?: CapabilityExecutionResult
): Activity {
  return {
    id: crypto.randomUUID(),
    capabilityName,
    status,
    timestamp: new Date().toLocaleTimeString(),
    input,
    result,
  };
}

export default function WebMCPProvider() {
  useEffect(() => {
    const modelContext = document.modelContext;

    if (!modelContext) {
      console.warn("AgentSpace: WebMCP unavailable");
      return;
    }

    const controller = new AbortController();

    // Clean registrations created by a previous HMR session.
    window.__agentspace_webmcp_controller__?.abort();
    window.__agentspace_webmcp_controller__ = controller;

    async function registerTools() {
      try {
        await modelContext.registerTool(
          {
            name: "get_project_capabilities",
            title: "Get Project Capabilities",
            description:
              "Return the capabilities available in the AgentSpace project.",
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            execute: async () => {
              const result: CapabilityExecutionResult = {
                success: true,
                data: {
                  project: "AgentSpace",
                  framework: "Next.js",
                  language: "TypeScript",
                  capabilities: DEFAULT_CAPABILITIES.map((cap) => cap.name),
                },
                executionTimeMs: 1,
              };

              emitActivity(
                activity("get_project_capabilities", "success", {}, result)
              );
              return result;
            },
          },
          { signal: controller.signal }
        );

        await modelContext.registerTool(
          {
            name: "get_environment",
            title: "Get Environment",
            description:
              "Return the environment and runtime capabilities available to the agent.",
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            execute: async () => {
              const result: CapabilityExecutionResult = {
                success: true,
                data: {
                  runtime: "browser",
                  framework: "Next.js",
                  language: "TypeScript",
                  node: true,
                  python: false,
                  docker: false,
                  filesystem: "restricted",
                  network: true,
                },
                executionTimeMs: 1,
              };

              emitActivity(activity("get_environment", "success", {}, result));
              return result;
            },
          },
          { signal: controller.signal }
        );

        await modelContext.registerTool(
          {
            name: "find_component",
            title: "Find Component",
            description: "Find existing components matching a query.",
            inputSchema: {
              type: "object",
              properties: {
                query: { type: "string", description: "Search query" },
              },
              required: ["query"],
            },
            execute: async (input = {}) => {
              const query = String(input.query ?? "");
              const matches = componentStore.filter((component) =>
                component.toLowerCase().includes(query.toLowerCase())
              );

              const result: CapabilityExecutionResult = {
                success: true,
                data: { query, matches },
                executionTimeMs: 2,
              };

              emitActivity(activity("find_component", "success", input, result));
              return result;
            },
          },
          { signal: controller.signal }
        );

        await modelContext.registerTool(
          {
            name: "create_component",
            title: "Create Component",
            description: "Create a new UI component in the project workspace.",
            inputSchema: {
              type: "object",
              properties: {
                name: { type: "string", description: "Component name" },
                path: { type: "string", description: "Optional target path" },
                content: { type: "string", description: "Optional source code" },
              },
              required: ["name"],
            },
            execute: async (input = {}) => {
              const name = String(input.name ?? "").trim();

              if (!name) {
                const result: CapabilityExecutionResult = {
                  success: false,
                  error: "Component name is required.",
                };
                emitActivity(activity("create_component", "error", input, result));
                return result;
              }

              const filename = name.endsWith(".tsx") ? name : `${name}.tsx`;
              if (!componentStore.includes(filename)) componentStore.push(filename);

              const result: CapabilityExecutionResult = {
                success: true,
                data: { component: filename, message: `${filename} created.` },
                executionTimeMs: 3,
              };

              emitActivity(activity("create_component", "success", input, result));
              return result;
            },
          },
          { signal: controller.signal }
        );

        await modelContext.registerTool(
          {
            name: "run_tests",
            title: "Run Tests",
            description: "Run project verification checks.",
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            execute: async () => {
              const result: CapabilityExecutionResult = {
                success: true,
                data: { passed: 12, failed: 0, message: "All checks passed." },
                executionTimeMs: 24,
              };
              emitActivity(activity("run_tests", "success", {}, result));
              return result;
            },
          },
          { signal: controller.signal }
        );

        await modelContext.registerTool(
          {
            name: "build_project",
            title: "Build Project",
            description: "Verify that the production build succeeds.",
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            execute: async () => {
              const result: CapabilityExecutionResult = {
                success: true,
                data: { message: "Production build verification passed." },
                executionTimeMs: 51,
              };
              emitActivity(activity("build_project", "success", {}, result));
              return result;
            },
          },
          { signal: controller.signal }
        );

        const tools = await modelContext.getTools();
        console.log(
          "AgentSpace registered tools:",
          tools.map((tool) => tool.name)
        );
      } catch (error) {
        console.error("AgentSpace WebMCP registration failed:", error);
      }
    }

    void registerTools();

    return () => {
      controller.abort();
      if (window.__agentspace_webmcp_controller__ === controller) {
        delete window.__agentspace_webmcp_controller__;
      }
    };
  }, []);

  return null;
}

export function useWebMCP() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [status, setStatus] = useState<
    "checking" | "connected" | "unavailable" | "error"
  >("checking");
  const [toolCount, setToolCount] = useState(0);

  useEffect(() => {
    const modelContext = document.modelContext;

    if (!modelContext) {
      setStatus("unavailable");
      return;
    }

    setStatus("connected");

    void modelContext
      .getTools()
      .then((tools) => {
        setToolCount(
          tools.filter((tool) =>
            WEBMCP_TOOLS.includes(
              tool.name as (typeof WEBMCP_TOOLS)[number]
            )
          ).length
        );
      })
      .catch(() => setStatus("error"));

    const handleActivity = (event: Event) => {
      const customEvent = event as CustomEvent<Activity>;
      setActivities((current) => [...current, customEvent.detail]);
    };

    window.addEventListener("agentspace:activity", handleActivity);

    return () => {
      window.removeEventListener("agentspace:activity", handleActivity);
    };
  }, []);

  async function executeCapability(
    name: string,
    params: Record<string, unknown> = {}
  ) {
    const modelContext = document.modelContext;
    if (!modelContext) throw new Error("WebMCP is unavailable.");

    const tools = await modelContext.getTools();
    const tool = tools.find((item) => item.name === name);

    if (!tool) {
      throw new Error(`WebMCP tool "${name}" is not registered.`);
    }

    return modelContext.executeTool(tool, params);
  }

  return {
    status,
    toolCount,
    capabilities: DEFAULT_CAPABILITIES as Capability[],
    activities,
    executeCapability,
    clearActivities: () => setActivities([]),
  };
}
