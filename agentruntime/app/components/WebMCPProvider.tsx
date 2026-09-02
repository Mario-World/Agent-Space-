"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  Capability,
  DEFAULT_CAPABILITIES,
  CapabilityExecutionResult,
} from "@/lib/agentspace/capabilities";

export interface ActivityEntry {
  id: string;
  timestamp: string;
  capabilityName: string;
  input: Record<string, unknown>;
  result?: CapabilityExecutionResult;
  status: "pending" | "success" | "error";
}

interface WebMCPContextType {
  capabilities: Capability[];
  activities: ActivityEntry[];
  executeCapability: (
    name: string,
    params?: Record<string, unknown>
  ) => Promise<CapabilityExecutionResult>;
  clearActivities: () => void;
  registerCapability: (capability: Capability) => void;
}

const WebMCPContext = createContext<WebMCPContextType | undefined>(undefined);

export function WebMCPProvider({ children }: { children: ReactNode }) {
  const [capabilities, setCapabilities] = useState<Capability[]>(DEFAULT_CAPABILITIES);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  const registerCapability = useCallback((newCap: Capability) => {
    setCapabilities((prev) => {
      if (prev.some((c) => c.name === newCap.name)) {
        return prev.map((c) => (c.name === newCap.name ? newCap : c));
      }
      return [...prev, newCap];
    });
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  const executeCapability = useCallback(
    async (name: string, params: Record<string, unknown> = {}): Promise<CapabilityExecutionResult> => {
      const cap = capabilities.find((c) => c.name === name || c.id === name);
      const activityId = `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const startTime = performance.now();

      const newEntry: ActivityEntry = {
        id: activityId,
        timestamp: new Date().toLocaleTimeString(),
        capabilityName: name,
        input: params,
        status: "pending",
      };

      setActivities((prev) => [newEntry, ...prev]);

      try {
        let result: CapabilityExecutionResult;
        if (cap && cap.handler) {
          result = await cap.handler(params);
        } else {
          await new Promise((res) => setTimeout(res, 400));
          result = {
            success: true,
            data: {
              message: `Executed capability "${name}" successfully`,
              params,
            },
            executionTimeMs: Math.round(performance.now() - startTime),
          };
        }

        setActivities((prev) =>
          prev.map((entry) =>
            entry.id === activityId
              ? { ...entry, status: result.success ? "success" : "error", result }
              : entry
          )
        );

        return result;
      } catch (err: unknown) {
        const errorResult: CapabilityExecutionResult = {
          success: false,
          error: err instanceof Error ? err.message : String(err),
          executionTimeMs: Math.round(performance.now() - startTime),
        };

        setActivities((prev) =>
          prev.map((entry) =>
            entry.id === activityId
              ? { ...entry, status: "error", result: errorResult }
              : entry
          )
        );

        return errorResult;
      }
    },
    [capabilities]
  );

  return (
    <WebMCPContext.Provider
      value={{
        capabilities,
        activities,
        executeCapability,
        clearActivities,
        registerCapability,
      }}
    >
      {children}
    </WebMCPContext.Provider>
  );
}

export function useWebMCP(): WebMCPContextType {
  const context = useContext(WebMCPContext);
  if (!context) {
    throw new Error("useWebMCP must be used within a WebMCPProvider");
  }
  return context;
}
