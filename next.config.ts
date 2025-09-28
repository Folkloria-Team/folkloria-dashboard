import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://localhost:3333/*")],
  },
};

export default nextConfig;
