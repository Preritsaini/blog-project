'use client'

import { useActionState, useState } from 'react'
import { updatePost, type PostFormState } from '@/actions/posts'
import { generateSlug } from '@/lib/slug'
import PostEditor from '@/components/admin/PostEditor'
import ImageUploader from '@/components/admin/ImageUploader'
import SubmitButton from '@/components/ui/SubmitButton'
import type { BlogPost } from '@/lib/firestore/posts'

interface EditPostFormProps {
  post: BlogPost
}

const initialState: PostFormState = {}

export default function EditPostForm({ post }: EditPostFormProps) {
  const boundAction = updatePost.bind(null, post.id)
  const [state, formAction] = useActionState(boundAction, initialState)
  const [slug, setSlug] = useState(post.slug)
  const [body, setBody] = useState(post.body)
  const [coverImage, setCoverImage] = useState(post.coverImage)

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(generateSlug(e.target.value))
  }

  const inputClass =
    'rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]'
  const errorClass = 'mt-1 text-xs text-red-600'
  const labelClass = 'block text-sm font-medium text-[var(--color-charcoal)] mb-1'

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-2xl">
      {state.serverError && (
        <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {state.serverError}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={post.title}
          onChange={handleTitleChange}
          className={inputClass}
        />
        {state.errors?.title && (
          <p className={errorClass}>{state.errors.title[0]}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className={labelClass}>Slug</label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={inputClass}
        />
        {state.errors?.slug && (
          <p className={errorClass}>{state.errors.slug[0]}</p>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className={labelClass}>Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          defaultValue={post.excerpt}
          className={inputClass}
        />
        {state.errors?.excerpt && (
          <p className={errorClass}>{state.errors.excerpt[0]}</p>
        )}
      </div>

      {/* Cover Image — upload to Firebase Storage */}
      <div>
        <input type="hidden" name="coverImage" value={coverImage} />
        <ImageUploader
          value={coverImage}
          onChange={setCoverImage}
          folder="posts"
          label="Cover Image"
        />
        {state.errors?.coverImage && (
          <p className={errorClass}>{state.errors.coverImage[0]}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className={labelClass}>Tags (comma-separated)</label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={post.tags.join(', ')}
          className={inputClass}
        />
        {state.errors?.tags && (
          <p className={errorClass}>{state.errors.tags[0]}</p>
        )}
      </div>

      {/* Body */}
      <div>
        <label className={labelClass}>Body</label>
        <input type="hidden" name="body" value={body} />
        <PostEditor value={body} onChange={setBody} />
        {state.errors?.body && (
          <p className={errorClass}>{state.errors.body[0]}</p>
        )}
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          value="true"
          defaultChecked={post.published}
          className="h-4 w-4 rounded border-[var(--color-charcoal)]/20 text-[var(--color-indigo-deep)] focus:ring-[var(--color-indigo-deep)]"
        />
        <label htmlFor="published" className="text-sm font-medium text-[var(--color-charcoal)]">
          Published
        </label>
      </div>

      <div>
        <SubmitButton label="Save Changes" pendingLabel="Saving…" />
      </div>
    </form>
  )
}
