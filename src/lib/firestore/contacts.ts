import 'server-only'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import type { ContactSubmission } from './utils'

export type { ContactSubmission }

function requireDb() {
  if (!adminApp) {
    throw new Error(
      'Firebase Admin SDK is not initialised. ' +
      'Contact form submissions cannot be saved. Check your .env.local file.'
    )
  }
  return getFirestore(adminApp)
}

export async function saveContact(
  data: Omit<ContactSubmission, 'submittedAt'>
): Promise<void> {
  await requireDb()
    .collection('contacts')
    .add({ ...data, submittedAt: Timestamp.now() })
}
