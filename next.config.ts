import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
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
