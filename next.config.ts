import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/:path*`,
      },
    ];
  },
  images: {
    domains: ['img.clerk.com'],
  },
  // Allow both localhost and 127.0.0.1 in development
  allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000'],
  // Disable ESLint during build for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
