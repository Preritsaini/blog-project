import type { NextConfig } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulcompass.co'

// Content-Security-Policy — tightened for production
const csp = [
  `default-src 'self'`,
  // Scripts: self + Next.js inline scripts (nonce not yet wired, so unsafe-inline for now)
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
  // Styles: self + inline (Tailwind injects inline styles)
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  // Fonts
  `font-src 'self' https://fonts.gstatic.com`,
  // Images: self + Firebase Storage + data URIs
  `img-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com`,
  // Connect: self + Firebase APIs
  `connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com wss://*.firebaseio.com`,
  // Frames: deny
  `frame-src 'none'`,
  `frame-ancestors 'none'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
].join('; ')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
    // Serve modern formats
    formats: ['image/avif', 'image/webp'],
  },

  reactStrictMode: true,

  devIndicators: false,

  // Compress responses
  compress: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy',   value: csp },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache public images
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // Redirect www → non-www (update if your domain is www-first)
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${new URL(siteUrl).hostname}` }],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
    ]
  },
}

export default nextConfig
