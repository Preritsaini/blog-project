import 'server-only'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import {
  filterRecentPosts,
  filterPublishedPosts,
  filterRelatedPosts,
  type BlogPost,
} from './utils'

export type { BlogPost }

function db() {
  if (!adminApp) return null
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

/** Fetches the 3 most recently published posts. */
export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  const database = db()
  if (!database) return []
  const snap = await database
    .collection('posts')
    .where('published', '==', true)
    .orderBy('publishedAt', 'desc')
    .limit(limit)
    .get()
  return snap.docs.map(docToBlogPost)
}

/** Fetches all published posts ordered by publishedAt desc. */
export async function getAllPosts(): Promise<BlogPost[]> {
  const database = db()
  if (!database) return []
  const snap = await database
    .collection('posts')
    .where('published', '==', true)
    .orderBy('publishedAt', 'desc')
    .get()
  return snap.docs.map(docToBlogPost)
}

/** Fetches a single published post by slug. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
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
}

/** Returns up to `limit` published posts sharing at least one tag with the given post. */
export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const database = db()
  if (!database) return []
  const snap = await database
    .collection('posts')
    .where('published', '==', true)
    .get()
  const all = snap.docs.map(docToBlogPost)
  return filterRelatedPosts(post, all, limit)
}

/** Fetches all posts (published + draft) for the admin list. */
export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  const snap = await db()
    .collection('posts')
    .orderBy('publishedAt', 'desc')
    .get()
  return snap.docs.map(docToBlogPost)
}

/** Fetches a single post by Firestore document ID. */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const doc = await db().collection('posts').doc(id).get()
  if (!doc.exists) return null
  return docToBlogPost(doc)
}

// Re-export pure helpers for consumers that need them
export { filterRecentPosts, filterPublishedPosts, filterRelatedPosts }
