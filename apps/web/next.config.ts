import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPO_NAME || 'BengalStitch';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true,
  transpilePackages: ['@bengalstitch/shared'],
  images: {
    unoptimized: true,
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
