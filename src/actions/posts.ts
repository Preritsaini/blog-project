'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import { PostSchema } from '@/lib/validations'

export interface PostFormState {
  errors?: {
    title?: string[]
    slug?: string[]
    excerpt?: string[]
    coverImage?: string[]
    tags?: string[]
    body?: string[]
    published?: string[]
  }
  serverError?: string
}

function db() {
  return getFirestore(adminApp)
}

function revalidatePostPaths(slug?: string) {
  revalidatePath('/blog')
  revalidatePath('/')
  if (slug) {
    revalidatePath(`/blog/${slug}`)
  } else {
    revalidatePath('/blog/[slug]', 'page')
  }
}

export async function createPost(
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const raw = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: formData.get('excerpt') as string ?? '',
    coverImage: formData.get('coverImage') as string ?? '',
    tags: formData.getAll('tags') as string[],
    body: formData.get('body') as string ?? '',
    published: formData.get('published') === 'true',
  }

  const result = PostSchema.safeParse(raw)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    const now = Timestamp.now()
    await db().collection('posts').add({
      ...result.data,
      createdAt: now,
      updatedAt: now,
      publishedAt: result.data.published ? now : null,
    })
  } catch {
    return { serverError: 'Something went wrong. Please try again.' }
  }

  revalidatePostPaths(result.data.slug)
  redirect('/admin/posts')
}

export async function updatePost(
  id: string,
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const raw = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: formData.get('excerpt') as string ?? '',
    coverImage: formData.get('coverImage') as string ?? '',
    tags: formData.getAll('tags') as string[],
    body: formData.get('body') as string ?? '',
    published: formData.get('published') === 'true',
  }

  const result = PostSchema.safeParse(raw)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    await db().collection('posts').doc(id).update({
      ...result.data,
      updatedAt: Timestamp.now(),
    })
  } catch {
    return { serverError: 'Something went wrong. Please try again.' }
  }

  revalidatePostPaths(result.data.slug)
  redirect('/admin/posts')
}

export async function deletePost(id: string): Promise<void> {
  await db().collection('posts').doc(id).delete()
  revalidatePostPaths()
  redirect('/admin/posts')
}
