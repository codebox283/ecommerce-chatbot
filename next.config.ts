import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['static.wixstatic.com'], // Add allowed image domains here
  },
};

export default nextConfig;
