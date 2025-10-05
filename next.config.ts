import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://localhost:3333/*")],
  },
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true, // Temporary - to see if it's a TS error
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporary - to see if it's an ESLint error
  },
};

export default nextConfig;
