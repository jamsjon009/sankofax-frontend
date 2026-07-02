import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.digitaloceanspaces.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

export default nextConfig
