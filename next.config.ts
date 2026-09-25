import type { NextConfig } from "next";

// project site: served under /<repo>, not at the domain root
const basePath = "/bayrjargal.github.io";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // next/link and next/image prefix basePath themselves; raw <video>/poster
  // attributes do not, so they read it from here
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
