import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@amarpod/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', '@tanstack/react-query'],
  },
};

export default nextConfig;
