import type { NextConfig } from 'next';

const apiInternalUrl = (
  process.env.API_INTERNAL_URL ?? 'http://127.0.0.1:4000'
).replace(/\/$/, '');

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        destination: `${apiInternalUrl}/api/:path*`,
        source: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
