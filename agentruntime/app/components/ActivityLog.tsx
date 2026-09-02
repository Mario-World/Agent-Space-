"use client";

import React from "react";
import { useWebMCP } from "./WebMCPProvider";

export function ActivityLog() {
  const { activities, clearActivities } = useWebMCP();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Execution Activity Log
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Live stream of agent interactions and capability executions
          </p>
        </div>
        {activities.length > 0 && (
          <button
            onClick={clearActivities}
            className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            Clear Log
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-10 text-center dark:border-zinc-800">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            No agent activity yet. Test a capability above or trigger WebMCP actions.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 font-mono text-xs">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      act.status === "success"
                        ? "bg-emerald-500"
                        : act.status === "pending"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {act.capabilityName}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    [{act.timestamp}]
                  </span>
                </div>
                {act.result && (
                  <pre className="mt-1 max-h-32 overflow-auto rounded bg-zinc-200/60 p-2 text-[11px] text-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                    {JSON.stringify(act.result, null, 2)}
                  </pre>
                )}
              </div>

              {act.result?.executionTimeMs !== undefined && (
                <span className="text-[10px] text-zinc-400">
                  {act.result.executionTimeMs}ms
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
