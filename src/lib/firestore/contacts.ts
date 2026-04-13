import 'server-only'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import type { ContactSubmission } from './utils'

export type { ContactSubmission }

function db() {
  return getFirestore(adminApp)
}

/** Writes a ContactSubmission document to the contacts collection. */
export async function saveContact(
  data: Omit<ContactSubmission, 'submittedAt'>
): Promise<void> {
  await db()
    .collection('contacts')
    .add({
      ...data,
      submittedAt: Timestamp.now(),
    })
}
