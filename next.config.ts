import { dirname } from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const rootDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    // always lock turbopack to the project root, even when commands run from a subdirectory
    root: rootDir,
  },
};

export default nextConfig;
