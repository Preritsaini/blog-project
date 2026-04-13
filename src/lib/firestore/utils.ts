/**
 * Pure helper functions for filtering and sorting Firestore data.
 * These are extracted so they can be property-tested without Firestore.
 */

import type { Timestamp } from 'firebase-admin/firestore'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  coverImage: string
  tags: string[]
  published: boolean
  publishedAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Service {
  id: string
  name: string
  description: string
  duration: string
  price: string
  bookingLink: string
  active: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
  submittedAt: Timestamp
}

/** Returns up to `limit` published posts sorted by publishedAt descending. */
export function filterRecentPosts(posts: BlogPost[], limit: number): BlogPost[] {
  return posts
    .filter((p) => p.published)
    .sort((a, b) => b.publishedAt.toMillis() - a.publishedAt.toMillis())
    .slice(0, limit)
}

/** Returns all published posts sorted by publishedAt descending. */
export function filterPublishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter((p) => p.published)
    .sort((a, b) => b.publishedAt.toMillis() - a.publishedAt.toMillis())
}

/**
 * Returns up to `limit` published posts (excluding the source post)
 * that share at least one tag with the source post.
 */
export function filterRelatedPosts(
  post: BlogPost,
  allPosts: BlogPost[],
  limit: number
): BlogPost[] {
  const sourceTags = new Set(post.tags)
  return allPosts
    .filter(
      (p) =>
        p.published &&
        p.id !== post.id &&
        p.tags.some((t) => sourceTags.has(t))
    )
    .slice(0, limit)
}

/** Returns only services where active === true. */
export function filterActiveServices(services: Service[]): Service[] {
  return services.filter((s) => s.active)
}
