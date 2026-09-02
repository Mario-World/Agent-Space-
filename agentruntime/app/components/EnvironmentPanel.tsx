"use client";

import React, { useEffect, useState } from "react";
import { getEnvironmentInfo, EnvironmentInfo } from "@/lib/agentspace/environment";

export function EnvironmentPanel() {
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);

  useEffect(() => {
    setEnvInfo(getEnvironmentInfo());
  }, []);

  if (!envInfo) return null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Runtime Environment
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Agent runtime context and detected project environment
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <span className="text-zinc-500 dark:text-zinc-400">Framework</span>
          <p className="mt-1 font-mono font-medium text-zinc-900 dark:text-zinc-100">
            {envInfo.framework}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <span className="text-zinc-500 dark:text-zinc-400">Package Manager</span>
          <p className="mt-1 font-mono font-medium text-zinc-900 dark:text-zinc-100">
            {envInfo.packageManager}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <span className="text-zinc-500 dark:text-zinc-400">Node / Platform</span>
          <p className="mt-1 font-mono font-medium text-zinc-900 dark:text-zinc-100">
            {envInfo.os}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <span className="text-zinc-500 dark:text-zinc-400">Capabilities</span>
          <p className="mt-1 font-mono font-medium text-emerald-600 dark:text-emerald-400">
            {envInfo.capabilitiesCount} active
          </p>
        </div>
      </div>
    </div>
  );
}
