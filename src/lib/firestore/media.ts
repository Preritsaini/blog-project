import 'server-only'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'

export interface MediaItem {
  id: string
  url: string
  storagePath: string
  name: string
  uploadedAt: Timestamp
}

function db() {
  if (!adminApp) {
    throw new Error('Firebase Admin SDK is not initialised. Check your .env.local file.')
  }
  return getFirestore(adminApp)
}

export async function getAllMedia(): Promise<MediaItem[]> {
  const snap = await db()
    .collection('media')
    .orderBy('uploadedAt', 'desc')
    .get()
  return snap.docs.map((doc) => {
    const d = doc.data()
    return {
      id: doc.id,
      url: d.url,
      storagePath: d.storagePath,
      name: d.name,
      uploadedAt: d.uploadedAt,
    }
  })
}

export async function saveMediaItem(
  item: Omit<MediaItem, 'id' | 'uploadedAt'>
): Promise<string> {
  const ref = await db().collection('media').add({
    ...item,
    uploadedAt: Timestamp.now(),
  })
  return ref.id
}

export async function deleteMediaItem(id: string): Promise<void> {
  await db().collection('media').doc(id).delete()
}
