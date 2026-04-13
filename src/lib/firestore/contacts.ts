import 'server-only'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import type { ContactSubmission } from './utils'

export type { ContactSubmission }

function db() {
  if (!adminApp) return null
  return getFirestore(adminApp)
}

/** Writes a ContactSubmission document to the contacts collection. */
export async function saveContact(
  data: Omit<ContactSubmission, 'submittedAt'>
): Promise<void> {
  const database = db()
  if (!database) {
    throw new Error('Firebase Admin SDK not configured. Cannot save contact submission.')
  }
  await database
    .collection('contacts')
    .add({
      ...data,
      submittedAt: Timestamp.now(),
    })
}
