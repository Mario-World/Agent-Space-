"use client";

import WebMCPProvider from "./components/WebMCPProvider";

export default function Home() {
  return (
    <>
      <WebMCPProvider />

      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-8 py-20">
          <div className="mb-12">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-zinc-500">
              AGENTSPACE
            </p>

            <h1 className="text-5xl font-semibold tracking-tight">
              Give your AI agent
              <br />
              <span className="text-zinc-500">
                capabilities, not more context.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              A WebMCP capability layer that lets AI agents
              discover what a project can do before taking
              action.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                WebMCP
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Agent capability interface
              </h2>

              <p className="mt-3 text-zinc-400">
                This page exposes structured tools through
                <code className="mx-1 text-zinc-200">
                  document.modelContext
                </code>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Registered tools
              </p>

              <div className="mt-5 space-y-3">
                <Tool name="get_project_capabilities" />
                <Tool name="get_environment" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Tool({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-zinc-950 px-4 py-3">
      <code className="text-sm text-zinc-300">
        {name}()
      </code>

      <span className="text-xs text-green-400">
        ready
      </span>
    </div>
  );
}