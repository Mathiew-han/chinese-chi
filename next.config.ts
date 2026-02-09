import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

type NextConfigWithServerActions = NextConfig & {
  experimental?: NextConfig["experimental"] & {
    serverActions?: {
      bodySizeLimit?: string | number;
      allowedOrigins?: string[];
    };
  };
};

const nextConfig: NextConfigWithServerActions = {
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
};

export default withNextIntl(nextConfig);
