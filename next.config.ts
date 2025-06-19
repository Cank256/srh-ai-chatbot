import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/srh',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  allowedDevOrigins: ['67.211.221.121'],
};

export default nextConfig;
