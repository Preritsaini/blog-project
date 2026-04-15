import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/config'

// ─── SSG: robots.txt never changes ───────────────────────────────────────────
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
