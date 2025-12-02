import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "**",
      },
      {
        protocol: "http" as const,
        hostname: "**",
      },
    ],
  },
  /* config options here */
};

export default withNextIntl(nextConfig);
