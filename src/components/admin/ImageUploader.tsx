'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { uploadFile } from '@/lib/firebase/storage'
import { UploadButton } from '@/components/ui/Icons'
import ClientOnly from '@/components/ui/ClientOnly'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
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
    console.log('[ImageUploader] File selected:', file?.name)
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
    } catch (err: any) {
      console.error('[ImageUploader] Upload failed:', err)
      setError(`Upload failed: ${err.message || 'Please try again.'}`)
    } finally {
      setProgress(null)
      // Safely reset the input so the same file can be re-selected
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
      <ClientOnly>
        <UploadButton
          ref={inputRef}
          label={value ? 'Replace image' : 'Upload image'}
          className="flex cursor-pointer items-center gap-2 self-start rounded-md border border-[var(--color-indigo-deep)]/30 bg-white px-4 py-2 text-sm font-medium text-[var(--color-indigo-deep)] hover:bg-[var(--color-indigo-deep)]/5 transition-colors"
          onChange={handleFile}
          disabled={progress !== null}
        />
      </ClientOnly>

      {/* Progress bar */}
      {progress !== null && (
        <div className="mt-2">
          <p className="mb-1 text-xs font-medium text-[var(--color-indigo-deep)]">
            Uploading… {progress}%
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-indigo-deep)]/10">
            <div
              className="h-full bg-[var(--color-indigo-deep)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
