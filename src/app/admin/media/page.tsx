import { getAllMedia } from '@/lib/firestore/media'
import MediaLibraryWrapper from './MediaLibraryWrapper'

export default async function AdminMediaPage() {
  const items = await getAllMedia()
  return <MediaLibraryWrapper initialItems={items} />
}
