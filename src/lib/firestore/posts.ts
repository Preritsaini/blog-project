import 'server-only'
import { getFirestore } from 'firebase-admin/firestore'
import { unstable_cache } from 'next/cache'
import { adminApp } from '@/lib/firebase/admin'
import {
  filterRecentPosts,
  filterPublishedPosts,
  filterRelatedPosts,
  type BlogPost,
} from './utils'

export type { BlogPost }

/** Returns Firestore or null if Admin SDK isn't configured. */
function db() {
  if (!adminApp) return null
  return getFirestore(adminApp)
}

/** Returns Firestore or throws — use in admin-only paths. */
function requireDb() {
  if (!adminApp) {
    throw new Error(
      'Firebase Admin SDK is not initialised. Check your .env.local file.'
    )
  }
  return getFirestore(adminApp)
}

function docToBlogPost(
  doc: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot
): BlogPost {
  const data = doc.data()!
  return {
    id: doc.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    body: data.body,
    coverImage: data.coverImage,
    tags: data.tags ?? [],
    published: data.published,
    publishedAt: data.publishedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

// ─── Cached public fetchers ───────────────────────────────────────────────────

export const getRecentPosts = unstable_cache(
  async (limit = 3): Promise<BlogPost[]> => {
    const database = db()
    if (!database) return []
    const snap = await database
      .collection('posts')
      .where('published', '==', true)
      .orderBy('publishedAt', 'desc')
      .limit(limit)
      .get()
    return snap.docs.map(docToBlogPost)
  },
  ['recent-posts'],
  { tags: ['posts'], revalidate: 60 }
)

export const getAllPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const database = db()
    if (!database) return []
    const snap = await database
      .collection('posts')
      .where('published', '==', true)
      .orderBy('publishedAt', 'desc')
      .get()
    return snap.docs.map(docToBlogPost)
  },
  ['all-posts'],
  { tags: ['posts'], revalidate: 60 }
)

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const database = db()
    if (!database) return null
    const snap = await database
      .collection('posts')
      .where('published', '==', true)
      .where('slug', '==', slug)
      .limit(1)
      .get()
    if (snap.empty) return null
    return docToBlogPost(snap.docs[0])
  },
  ['post-by-slug'],
  { tags: ['posts'], revalidate: 60 }
)

export const getRelatedPosts = unstable_cache(
  async (post: BlogPost, limit = 3): Promise<BlogPost[]> => {
    const database = db()
    if (!database) return []
    const snap = await database
      .collection('posts')
      .where('published', '==', true)
      .get()
    const all = snap.docs.map(docToBlogPost)
    return filterRelatedPosts(post, all, limit)
  },
  ['related-posts'],
  { tags: ['posts'], revalidate: 60 }
)

// ─── Admin-only fetchers (not cached, always fresh) ───────────────────────────

export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  const snap = await requireDb()
    .collection('posts')
    .orderBy('publishedAt', 'desc')
    .get()
  return snap.docs.map(docToBlogPost)
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const doc = await requireDb().collection('posts').doc(id).get()
  if (!doc.exists) return null
  return docToBlogPost(doc)
}

export { filterRecentPosts, filterPublishedPosts, filterRelatedPosts }
