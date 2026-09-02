export type CapabilityCategory =
  | "discovery"
  | "environment"
  | "components"
  | "database"
  | "testing"
  | "deployment"
  | "custom";

export interface CapabilityParameter {
  type: string;
  description?: string;
  required?: boolean;
  enum?: string[];
  default?: unknown;
}

export interface CapabilitySchema {
  type: "object";
  properties: Record<string, CapabilityParameter>;
  required?: string[];
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  category: CapabilityCategory;
  inputSchema: CapabilitySchema;
  requiresConfirmation?: boolean;
  handler?: (params: Record<string, unknown>) => Promise<CapabilityExecutionResult> | CapabilityExecutionResult;
}

export interface CapabilityExecutionResult {
  success: boolean;
  data?: unknown;
  error?: string;
  executionTimeMs?: number;
}

export const DEFAULT_CAPABILITIES: Capability[] = [
  {
    id: "get_project_capabilities",
    name: "get_project_capabilities",
    description: "Returns the capabilities available in the current project.",
    category: "discovery",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Optional filter by capability category",
        },
      },
    },
  },
  {
    id: "get_environment",
    name: "get_environment",
    description: "Returns information about the current execution environment and runtime.",
    category: "environment",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    id: "find_component",
    name: "find_component",
    description: "Find existing components matching a query or pattern.",
    category: "components",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Component name or keywords to search for",
          required: true,
        },
      },
      required: ["query"],
    },
  },
  {
    id: "create_component",
    name: "create_component",
    description: "Create a new UI component in the project.",
    category: "components",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the component (PascalCase)",
          required: true,
        },
        path: {
          type: "string",
          description: "Target file path relative to components directory",
        },
        content: {
          type: "string",
          description: "Component code content",
        },
      },
      required: ["name"],
    },
  },
  {
    id: "update_component",
    name: "update_component",
    description: "Update an existing component's code or configuration.",
    category: "components",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the component to update",
          required: true,
        },
        content: {
          type: "string",
          description: "Updated component code",
          required: true,
        },
      },
      required: ["name", "content"],
    },
  },
  {
    id: "run_tests",
    name: "run_tests",
    description: "Run the project's test suite or a specific scope.",
    category: "testing",
    inputSchema: {
      type: "object",
      properties: {
        scope: {
          type: "string",
          description: "Optional test file or test pattern to run",
        },
      },
    },
  },
  {
    id: "build_project",
    name: "build_project",
    description: "Trigger a production build of the project to check for compilation errors.",
    category: "deployment",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    id: "deploy_preview",
    name: "deploy_preview",
    description: "Deploy a preview environment for the current state.",
    category: "deployment",
    requiresConfirmation: true,
    inputSchema: {
      type: "object",
      properties: {
        branch: {
          type: "string",
          description: "Branch name or preview identifier",
        },
      },
    },
  },
];

export function getProjectCapabilities(category?: CapabilityCategory): Capability[] {
  if (!category) return DEFAULT_CAPABILITIES;
  return DEFAULT_CAPABILITIES.filter((cap) => cap.category === category);
}

export function findCapability(name: string): Capability | undefined {
  return DEFAULT_CAPABILITIES.find((cap) => cap.name === name || cap.id === name);
}
