import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  output: "export",
};

export default nextConfig;
