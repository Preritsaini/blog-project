'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadFile } from '@/lib/firebase/storage'

interface ImageUploaderProps {
  /** Current image URL (shown as preview) */
  value: string
  /** Called with the new public download URL after upload */
  onChange: (url: string) => void
  /** Storage folder, defaults to 'media' */
  folder?: string
  label?: string
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'media',
  label = 'Cover Image',
}: ImageUploaderProps) {
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10 MB.')
      return
    }

    setError(null)
    setProgress(0)

    try {
      const { url } = await uploadFile(file, folder, setProgress)
      onChange(url)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setProgress(null)
      // reset so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[var(--color-charcoal)]">{label}</span>

      {/* Preview */}
      {value && (
        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-[var(--color-charcoal)]/10">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="600px" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload button */}
      <label className="flex cursor-pointer items-center gap-2 self-start rounded-md border border-[var(--color-indigo-deep)]/30 bg-white px-4 py-2 text-sm font-medium text-[var(--color-indigo-deep)] hover:bg-[var(--color-indigo-deep)]/5 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
        </svg>
        {value ? 'Replace image' : 'Upload image'}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFile}
        />
      </label>

      {/* Progress bar */}
      {progress !== null && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-charcoal)]/10">
          <div
            className="h-full bg-[var(--color-indigo-deep)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
