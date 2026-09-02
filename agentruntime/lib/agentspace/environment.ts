export interface EnvironmentInfo {
  nodeVersion: string;
  os: string;
  framework: string;
  cwd: string;
  packageManager: "npm" | "pnpm" | "yarn" | "bun";
  hasGit: boolean;
  capabilitiesCount: number;
}

export function getEnvironmentInfo(): EnvironmentInfo {
  return {
    nodeVersion: typeof process !== "undefined" ? process.version : "browser",
    os: typeof process !== "undefined" ? process.platform : "browser",
    framework: "Next.js",
    cwd: typeof process !== "undefined" && process.cwd ? process.cwd() : "/",
    packageManager: "npm",
    hasGit: true,
    capabilitiesCount: 8,
  };
}
