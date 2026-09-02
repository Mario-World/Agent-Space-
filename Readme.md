# AgentSpace

### Give your AI agent capabilities, not more context.

AgentSpace is a **WebMCP-powered developer tool** that turns a project's capabilities into structured tools that AI agents can discover and use.

Instead of asking an AI coding agent to repeatedly inspect a codebase, read documentation, search files, and figure out how a project works, AgentSpace exposes the project's important actions as reusable capabilities.

> **Context tells an agent what exists. Capabilities tell an agent what it can do.**

---

## The Problem

AI coding agents are becoming capable of building increasingly complex applications.

But a large part of an agent's work is still **discovery**:

```text
Inspect project
    ↓
Read package.json
    ↓
Search files
    ↓
Read documentation
    ↓
Understand dependencies
    ↓
Figure out available operations
    ↓
Decide what to call
    ↓
Finally perform the task
```

This creates unnecessary context and tool interactions.

Developers also don't have a clear view of:

* What capabilities their project exposes to an agent
* Which tools an agent can use
* What environment those tools operate in
* Which actions require additional permissions
* What the agent actually did to complete a task

AgentSpace addresses this by making **project capabilities explicit and agent-accessible**.

---

## The Solution

AgentSpace creates a **Capability Layer** between an application and an AI agent.

```text
                     Developer
                         │
                         ▼
                    AgentSpace
                         │
              ┌──────────┴──────────┐
              │                     │
       Capability Map          Environment
              │                     │
              └──────────┬──────────┘
                         │
                      WebMCP
                         │
                         ▼
                   OpenAI Agent
                         │
                         ▼
                  Project Actions
```

A project can expose capabilities such as:

```text
get_project_capabilities()
get_environment()
find_component()
create_component()
create_api()
run_tests()
build_project()
deploy_preview()
```

The agent can discover these tools through **WebMCP** instead of having to infer every operation from the application's UI or codebase.

---

## Why WebMCP?

WebMCP provides a structured mechanism for web applications to expose capabilities directly to AI agents.

Instead of an agent doing this:

```text
Look at UI
   ↓
Find button
   ↓
Understand form
   ↓
Enter values
   ↓
Click
   ↓
Interpret result
```

AgentSpace enables:

```text
Agent
  ↓
WebMCP
  ↓
create_component(...)
  ↓
Structured result
```

This makes the application's capabilities explicit, discoverable, and easier for an agent to use.

WebMCP is therefore not an add-on to AgentSpace.

**It is the interaction layer that makes the capability model useful to agents.**

---

# Core Experience

Imagine a developer has a Next.js application with authentication, payments, APIs, components, tests, and deployment.

The developer connects the project to AgentSpace.

AgentSpace creates a capability map:

```text
PROJECT CAPABILITIES

Components
├── find_component
├── create_component
└── update_component

Database
├── query_database
└── run_migration

Testing
├── run_unit_tests
└── run_e2e_tests

Deployment
└── deploy_preview
```

An OpenAI agent can then discover these capabilities.

The developer can simply ask:

> "Add a pricing page with subscription checkout."

The agent can reason over the available capabilities and execute the task:

```text
get_project_capabilities()
        ↓
find_component()
        ↓
create_component()
        ↓
create_api()
        ↓
run_tests()
        ↓
deploy_preview()
```

The developer sees what the agent is doing instead of watching an opaque sequence of UI interactions.

---

# Token & Context Efficiency

AgentSpace is designed around a simple hypothesis:

> **Structured capabilities can reduce unnecessary project discovery and repeated context gathering.**

Instead of repeatedly asking the model to inspect:

```text
README
package.json
source files
documentation
configuration
APIs
```

AgentSpace provides a structured capability surface.

For example:

```text
Traditional workflow

Agent
 ↓
Inspect project
 ↓
Search files
 ↓
Read documentation
 ↓
Understand API
 ↓
Determine action
 ↓
Execute
```

With AgentSpace:

```text
Agent
 ↓
get_project_capabilities()
 ↓
select capability
 ↓
execute
```

AgentSpace measures the workflow so developers can compare:

```text
                    Before        AgentSpace

Discovery calls       --             --
Tool calls             --             --
Context used           --             --
Task completed         ✓              ✓
```

> The project does **not** assume a fixed percentage of token savings. Measurements are collected from the actual workflow.

---

# Developer Experience

Initialize AgentSpace in a project:

```bash
npx agentspace init
```

AgentSpace analyzes the supported project structure and creates a capability configuration.

Example:

```text
agentspace/
├── capabilities/
│   ├── components
│   ├── testing
│   ├── database
│   └── deployment
│
├── environment.json
├── capabilities.json
└── webmcp.ts
```

The capability configuration describes:

```json
{
  "name": "run_tests",
  "description": "Run the project's test suite",
  "input": {
    "type": "object",
    "properties": {
      "scope": {
        "type": "string"
      }
    }
  }
}
```

AgentSpace then exposes supported capabilities through WebMCP.

---

# Architecture

```text
┌─────────────────────────────────────────────┐
│                 Developer                   │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                 AgentSpace                  │
│                                             │
│  Capability Discovery                       │
│  Environment Detection                      │
│  Tool Registry                              │
│  Permission Model                            │
│  Activity / Execution History                │
└──────────────────────┬──────────────────────┘
                       │
                       │ WebMCP
                       ▼
┌─────────────────────────────────────────────┐
│                 OpenAI Agent                │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                  Project                   │
│                                             │
│ Components │ APIs │ Database │ Tests │ Deploy│
└─────────────────────────────────────────────┘
```

---

# Example WebMCP Capabilities

### Project discovery

```text
get_project_capabilities()
```

Returns the capabilities available in the current project.

### Environment

```text
get_environment()
```

Returns information about the current execution environment.

### Components

```text
find_component()
create_component()
update_component()
```

### Development

```text
run_tests()
build_project()
```

### Deployment

```text
deploy_preview()
```

Each tool has a structured schema so the agent knows:

* What the tool does
* What parameters it accepts
* What it returns
* What constraints apply

---

# Human + Agent Collaboration

AgentSpace isn't designed to remove developers from the loop.

Instead:

```text
Human
  │
  │ Intent
  ▼
AI Agent
  │
  │ Discover capabilities
  ▼
AgentSpace
  │
  │ WebMCP
  ▼
Project
  │
  │ Result
  ▼
Human
```

The developer can inspect the capabilities and activity available to the agent and intervene when necessary.

The goal is:

> **Make agents more capable without making their behavior more opaque.**

---

# Example

Developer:

> Build a pricing page with a subscription checkout.

AgentSpace:

```text
AVAILABLE CAPABILITIES

✓ find_component
✓ create_component
✓ create_api
✓ run_tests
✓ deploy_preview
```

OpenAI agent:

```text
1. find_component("Pricing")
2. create_component(...)
3. create_api("checkout")
4. run_tests()
5. deploy_preview()
```

AgentSpace:

```text
TASK COMPLETE

✓ Pricing page created
✓ Checkout API connected
✓ Tests passed
✓ Preview deployed
```

---

# What We Built for the WebMCP Challenge

AgentSpace explores a question:

> **What happens when a web application exposes its capabilities directly to an AI agent instead of making the agent discover them through the UI?**

WebMCP allows us to experiment with this interaction model.

Our prototype demonstrates:

1. A project capability map
2. Structured WebMCP tools
3. AI-agent discovery
4. Agent-driven project actions
5. Human-visible execution activity
6. Comparison of discovery and execution overhead

---

# Technology

* **WebMCP** — Agent ↔ Web application capability interface
* **OpenAI** — AI agent / model layer
* **Next.js** — Application framework
* **TypeScript** — Application and tool definitions
* **React** — User interface
* **Tailwind CSS** — UI
* **Antigravity** — Development environment / agentic coding workflow
* **Vercel** — Deployment

---

# Project Status

🚧 **Hackathon Prototype**

The current implementation focuses on demonstrating the core capability-layer concept rather than providing a production-ready universal codebase analyzer.

Future versions could support:

* Automatic capability discovery
* More frameworks
* Custom developer-defined tools
* Capability versioning
* Permissions
* Environment-aware execution
* Agent observability
* Tool evaluation
* Team capability registries
* Capability usage analytics

---

# Future Vision

Today:

```text
AI Agent
   ↓
"Give me more context"
```

Tomorrow:

```text
AI Agent
   ↓
"What capabilities are available?"
   ↓
Structured tools
   ↓
Execute
```

We believe the next generation of AI development tools won't simply give agents **more context**.

They will give agents **better capabilities**.

---

# Built for The WebMCP Challenge

AgentSpace was built for **The WebMCP Challenge**, exploring how web applications can become better when designed for both humans and AI agents.

The project uses WebMCP as a core interaction mechanism rather than simply adding a demonstration tool.

**Challenge:** The WebMCP Challenge
**Track:** OpenAI
**Project:** AgentSpace

---

# License

MIT License
