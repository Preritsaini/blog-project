'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { uploadFile, deleteFile } from '@/lib/firebase/storage'
import { saveMedia, deleteMedia } from '@/actions/media'
import type { MediaItem } from '@/lib/firestore/media'
import { UploadButton } from '@/components/ui/Icons'
import ClientOnly from '@/components/ui/ClientOnly'

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
    console.log('[MediaLibrary] Files selected:', files.length)
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
            uploadedAt: Date.now(),
          },
          ...prev,
        ])
        console.log('[MediaLibrary] Successfully saved:', file.name)
      } catch (err) {
        console.error('[MediaLibrary] Failed to process:', file.name, err)
        setError(`Failed to upload ${file.name}.`)
      }
    }

    setUploading(false)
    setProgress(0)
    // Safely reset the input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = ''
  }

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<MediaItem | null>(null)

  async function handleDelete(item: MediaItem) {
    setConfirmDelete(null)
    setDeletingId(item.id)
    console.log('[MediaLibrary] Deleting item:', item.id, item.storagePath)
    try {
      console.log('[MediaLibrary] Deleting from storage...')
      await deleteFile(item.storagePath)
      console.log('[MediaLibrary] Deleting from firestore...')
      await deleteMedia(item.id, item.storagePath)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      console.log('[MediaLibrary] Delete successful.')
    } catch (err: any) {
      console.error('[MediaLibrary] Delete failed:', err)
      setError(`Failed to delete image: ${err.message || 'Unknown error'}`)
    } finally {
      setDeletingId(null)
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      {/* Custom Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[var(--color-plum-deep)] mb-2">Delete Image?</h3>
            <p className="text-sm text-[var(--color-charcoal)]/70 mb-6">
              Are you sure you want to delete "{confirmDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-semibold text-[var(--color-indigo-deep)]">
          Media Library
        </h1>

        <UploadButton
          ref={inputRef}
          label="Upload Images"
          className="flex cursor-pointer items-center gap-2 rounded-md bg-[var(--color-indigo-deep)] px-4 py-2 text-sm font-semibold text-[var(--color-off-white)] hover:opacity-90 transition-opacity"
          onChange={handleFiles}
          disabled={uploading}
          multiple
        />
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="mb-6">
          <p className="text-sm font-medium text-[var(--color-indigo-deep)] mb-1">Uploading… {progress}%</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-indigo-deep)]/10">
            <div
              className="h-full bg-[var(--color-indigo-deep)] transition-all duration-300"
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
              className={`group relative overflow-hidden rounded-lg border border-[var(--color-charcoal)]/10 bg-white ${
                deletingId === item.id ? 'opacity-50 grayscale' : ''
              }`}
            >
              <div className="relative h-40 w-full">
                <Image
                  suppressHydrationWarning
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
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    copyUrl(item.url)
                  }}
                  className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-indigo-deep)] hover:bg-gray-100"
                >
                  {copied === item.url ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setConfirmDelete(item)
                  }}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:bg-gray-400"
                >
                  {deletingId === item.id ? 'Deleting...' : 'Delete'}
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

