'use client'

import dynamic from 'next/dynamic'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface PostEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function PostEditor({ value, onChange }: PostEditorProps) {
  return (
    <div className="rounded-md border border-[var(--color-charcoal)]/20 overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        className="bg-white"
      />
    </div>
  )
}
