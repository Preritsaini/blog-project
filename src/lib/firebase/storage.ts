import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { app } from './client'

export const storage = getStorage(app)

export interface UploadResult {
  url: string
  path: string
}

/**
 * Upload a file to Firebase Storage and return its public download URL.
 * @param file - The File object to upload
 * @param folder - Storage folder, e.g. 'posts', 'media'
 * @param onProgress - Optional callback receiving 0–100 progress
 */
export async function uploadFile(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `${folder}/${uniqueName}`
  const storageRef = ref(storage, path)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    })

    task.on(
      'state_changed',
      (snap) => {
        if (onProgress) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100))
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve({ url, path })
      }
    )
  })
}

/**
 * Delete a file from Firebase Storage by its storage path.
 */
export async function deleteFile(path: string): Promise<void> {
  console.log('[Storage] Deleting file:', path)
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
  console.log('[Storage] File deleted successfully.')
}
