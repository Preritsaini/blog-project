'use client'

import dynamic from 'next/dynamic'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-50 animate-pulse border border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">Loading editor...</div>
})
import 'react-quill-new/dist/quill.snow.css'

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
