'use client'

import { useActionState, useState } from 'react'
import { createPost, type PostFormState } from '@/actions/posts'
import { generateSlug } from '@/lib/slug'
import PostEditor from '@/components/admin/PostEditor'
import SubmitButton from '@/components/ui/SubmitButton'

const initialState: PostFormState = {}

export default function NewPostPage() {
  const [state, formAction] = useActionState(createPost, initialState)
  const [slug, setSlug] = useState('')
  const [body, setBody] = useState('')

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    setSlug(generateSlug(title))
  }

  const inputClass =
    'rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]'
  const errorClass = 'mt-1 text-xs text-red-600'
  const labelClass = 'block text-sm font-medium text-[var(--color-charcoal)] mb-1'

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-[var(--color-indigo-deep)] mb-8">
        New Post
      </h1>

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
            className={inputClass}
          />
          {state.errors?.excerpt && (
            <p className={errorClass}>{state.errors.excerpt[0]}</p>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label htmlFor="coverImage" className={labelClass}>Cover Image URL</label>
          <input
            id="coverImage"
            name="coverImage"
            type="url"
            className={inputClass}
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
            placeholder="spirituality, coaching, mindfulness"
            className={inputClass}
          />
          {state.errors?.tags && (
            <p className={errorClass}>{state.errors.tags[0]}</p>
          )}
        </div>

        {/* Body */}
        <div>
          <label className={labelClass}>Body</label>
          {/* Hidden input carries the body value for form submission */}
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
            className="h-4 w-4 rounded border-[var(--color-charcoal)]/20 text-[var(--color-indigo-deep)] focus:ring-[var(--color-indigo-deep)]"
          />
          <label htmlFor="published" className="text-sm font-medium text-[var(--color-charcoal)]">
            Publish immediately
          </label>
        </div>

        <div>
          <SubmitButton label="Create Post" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  )
}
