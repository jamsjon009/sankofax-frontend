import type { NextConfig } from 'next'

// Allow next/image to load media from whatever backend NEXT_PUBLIC_MEDIA_URL
// points to (localhost in dev, the server IP/domain in production).
function mediaPattern() {
  const url = process.env.NEXT_PUBLIC_MEDIA_URL
  if (!url) return []
  try {
    const u = new URL(url)
    return [{
      protocol: u.protocol.replace(':', '') as 'http' | 'https',
      hostname: u.hostname,
      port: u.port || '',
    }]
  } catch {
    return []
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.digitaloceanspaces.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      ...mediaPattern(),
    ],
  },
}

export default nextConfig
