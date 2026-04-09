import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@bengalstitch/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'replicate.delivery' },
      { protocol: 'https', hostname: 'pbxt.replicate.delivery' },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', '@tanstack/react-query'],
  },
};

export default nextConfig;
