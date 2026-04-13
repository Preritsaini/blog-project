import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/firestore/posts'
import EditPostForm from './EditPostForm'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-[var(--color-indigo-deep)] mb-8">
        Edit Post
      </h1>
      <EditPostForm post={post} />
    </div>
  )
}
