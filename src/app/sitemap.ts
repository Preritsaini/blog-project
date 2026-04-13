import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/firestore/posts'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

// ---------------------------------------------------------------------------
// Pure builder — exported for property testing (no Firestore dependency)
// ---------------------------------------------------------------------------

export function buildSitemapEntries(
  slugs: string[],
  baseUrl: string
): { url: string; lastModified: Date }[] {
  const now = new Date()
  const staticRoutes = ['', '/blog', '/services', '/contact'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }))
  const postRoutes = slugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
  }))
  return [...staticRoutes, ...postRoutes]
}

// ---------------------------------------------------------------------------
// Next.js sitemap handler
// ---------------------------------------------------------------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const slugs = posts.map((p) => p.slug)
  return buildSitemapEntries(slugs, siteUrl)
}
