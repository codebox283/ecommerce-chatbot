import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['static.wixstatic.com'], // Add allowed image domains here
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', 
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
