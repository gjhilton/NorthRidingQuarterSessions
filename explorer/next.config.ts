import type { NextConfig } from "next";

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so every asset path needs the repo name prefixed -- only when building
// for Pages (GITHUB_PAGES=true, set by the deploy workflow), not for local
// `next dev`/`next start`.
const basePath = process.env.GITHUB_PAGES === "true" ? "/NorthRidingQuarterSessions" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Allows viewing the dev server from another device on the local network
  // (dev-only setting; irrelevant to the static export this config also
  // produces for GitHub Pages).
  allowedDevOrigins: ["192.168.1.198"],
};

export default nextConfig;
