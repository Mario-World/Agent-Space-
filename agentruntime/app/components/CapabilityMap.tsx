"use client";

import React, { useState } from "react";
import { useWebMCP } from "./WebMCPProvider";

export function CapabilityMap() {
  const { capabilities, executeCapability } = useWebMCP();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [executingName, setExecutingName] = useState<string | null>(null);

  const categories: string[] = [
    "all",
    ...Array.from(new Set(capabilities.map((c) => c.category))),
  ];

  const filteredCapabilities =
    selectedCategory === "all"
      ? capabilities
      : capabilities.filter((c) => c.category === selectedCategory);

  const handleExecute = async (name: string) => {
    setExecutingName(name);
    try {
      await executeCapability(name);
    } finally {
      setExecutingName(null);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Project Capability Map
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Explicit, discoverable actions exposed to AI agents via WebMCP
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors ${
                selectedCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredCapabilities.map((cap) => (
          <div
            key={cap.id}
            className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/50"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {cap.name}()
                </span>
                <span className="rounded-full bg-zinc-200/80 px-2 py-0.5 text-[11px] font-medium text-zinc-700 capitalize dark:bg-zinc-800 dark:text-zinc-300">
                  {cap.category}
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                {cap.description}
              </p>
              {cap.requiresConfirmation && (
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  ⚠️ Requires confirmation
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                disabled={executingName === cap.name}
                onClick={() => handleExecute(cap.name)}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {executingName === cap.name ? "Executing..." : "Test Capability"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
