import { getAllMedia } from '@/lib/firestore/media'
import MediaLibraryClient from './MediaLibraryClient'

export default async function AdminMediaPage() {
  const items = await getAllMedia()
  return <MediaLibraryClient initialItems={items} />
}
