import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images for placeholders and generated content
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
  // Optimize for Netlify deployment
  output: 'standalone',
};

export default nextConfig;
