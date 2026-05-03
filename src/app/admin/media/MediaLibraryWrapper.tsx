'use client'

import dynamic from 'next/dynamic'
import type { MediaItem } from '@/lib/firestore/media'

const MediaLibraryClient = dynamic(() => import('./MediaLibraryClient'), {
  ssr: false,
})

export default function MediaLibraryWrapper({ initialItems }: { initialItems: MediaItem[] }) {
  return <MediaLibraryClient initialItems={initialItems} />
}
