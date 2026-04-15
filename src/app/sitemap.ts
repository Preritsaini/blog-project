import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/firestore/posts'
import { siteConfig } from '@/lib/config'

// ─── ISR: regenerate sitemap every hour ──────────────────────────────────────
export const revalidate = 3600

export function buildSitemapEntries(
  slugs: string[],
  baseUrl: string
): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,               lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blog`,     lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
  ]

  const postRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const slugs = posts.map((p) => p.slug)
  return buildSitemapEntries(slugs, siteConfig.url)
}
