'use server'

import { revalidatePath } from 'next/cache'
import { saveMediaItem, deleteMediaItem } from '@/lib/firestore/media'

export async function saveMedia(
  url: string,
  storagePath: string,
  name: string
): Promise<{ id: string }> {
  const id = await saveMediaItem({ url, storagePath, name })
  revalidatePath('/admin/media')
  return { id }
}

export async function deleteMedia(id: string, _storagePath: string): Promise<void> {
  // Firestore record deletion — storage file deletion happens client-side
  // because firebase-admin Storage SDK requires a separate setup.
  // The client calls deleteFile(storagePath) then this action.
  await deleteMediaItem(id)
  revalidatePath('/admin/media')
}
