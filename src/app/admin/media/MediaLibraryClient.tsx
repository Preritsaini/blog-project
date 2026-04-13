'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadFile, deleteFile } from '@/lib/firebase/storage'
import { saveMedia, deleteMedia } from '@/actions/media'
import type { MediaItem } from '@/lib/firestore/media'

interface Props {
  initialItems: MediaItem[]
}

export default function MediaLibraryClient({ initialItems }: Props) {
  const [items, setItems] = useState<MediaItem[]>(initialItems)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setError(null)
    setUploading(true)

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image — skipped.`)
        continue
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name} exceeds 10 MB — skipped.`)
        continue
      }

      try {
        setProgress(0)
        const { url, path } = await uploadFile(file, 'media', setProgress)
        const { id } = await saveMedia(url, path, file.name)
        setItems((prev) => [
          {
            id,
            url,
            storagePath: path,
            name: file.name,
            uploadedAt: { toDate: () => new Date(), toMillis: () => Date.now() } as never,
          },
          ...prev,
        ])
      } catch {
        setError(`Failed to upload ${file.name}.`)
      }
    }

    setUploading(false)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return
    try {
      await deleteFile(item.storagePath)
      await deleteMedia(item.id, item.storagePath)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
    } catch {
      setError('Failed to delete image.')
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-semibold text-[var(--color-indigo-deep)]">
          Media Library
        </h1>

        <label className="flex cursor-pointer items-center gap-2 rounded-md bg-[var(--color-indigo-deep)] px-4 py-2 text-sm font-semibold text-[var(--color-off-white)] hover:opacity-90 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
          </svg>
          Upload Images
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFiles}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="mb-6">
          <p className="text-sm text-[var(--color-charcoal)]/70 mb-1">Uploading… {progress}%</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-charcoal)]/10">
            <div
              className="h-full bg-[var(--color-indigo-deep)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-charcoal)]/15 py-24 text-center">
          <p className="text-[var(--color-charcoal)]/50 text-sm">No images yet.</p>
          <p className="text-[var(--color-charcoal)]/40 text-xs mt-1">Click "Upload Images" to add photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg border border-[var(--color-charcoal)]/10 bg-white"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => copyUrl(item.url)}
                  className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-indigo-deep)] hover:bg-gray-100"
                >
                  {copied === item.url ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              <p className="truncate px-2 py-1.5 text-xs text-[var(--color-charcoal)]/60">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
