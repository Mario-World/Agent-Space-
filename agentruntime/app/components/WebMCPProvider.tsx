"use client";

/// <reference types="@mcp-b/webmcp-types" />

import { useEffect } from "react";

export default function WebMCPProvider() {
    useEffect(() => {
        console.log("=== AgentSpace WebMCP Debug ===");

        console.log(
            "document.modelContext:",
            document.modelContext
        );

        if (!document.modelContext) {
            console.error(
                "AgentSpace: document.modelContext is NOT available."
            );

            return;
        }

        const register = async () => {
            await document.modelContext.registerTool({
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
                    console.log(
                        "Tool executed: get_project_capabilities"
                    );

                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    project: "AgentSpace",
                                    framework: "Next.js",
                                    language: "TypeScript",

                                    capabilities: [
                                        "get_project_capabilities",
                                        "get_environment",
                                        "find_component",
                                        "create_component",
                                        "run_tests",
                                        "build_project",
                                    ],
                                }),
                            },
                        ],
                    };
                },
            });

            await document.modelContext.registerTool({
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
                    console.log(
                        "Tool executed: get_environment"
                    );

                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    runtime: "browser",
                                    framework: "Next.js",
                                    node: true,
                                    python: false,
                                    docker: false,
                                    filesystem: "restricted",
                                    network: true,
                                }),
                            },
                        ],
                    };
                },
            });

            console.log(
                "=== AgentSpace: WebMCP tools registered ==="
            );

            const tools =
                await document.modelContext.getTools();

            console.log(
                "AgentSpace registered tools:",
                tools
            );
        };

        register().catch((error) => {
            console.error(
                "AgentSpace WebMCP registration failed:",
                error
            );
        });
    }, []);

    return null;
}