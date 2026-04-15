import 'server-only'
import { getFirestore } from 'firebase-admin/firestore'
import { unstable_cache } from 'next/cache'
import { adminApp } from '@/lib/firebase/admin'
import { filterActiveServices, type Service } from './utils'

export type { Service }

function db() {
  if (!adminApp) return null
  return getFirestore(adminApp)
}

function requireDb() {
  if (!adminApp) {
    throw new Error('Firebase Admin SDK is not initialised. Check your .env.local file.')
  }
  return getFirestore(adminApp)
}

function docToService(
  doc: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot
): Service {
  const data = doc.data()!
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    duration: data.duration,
    price: data.price,
    bookingLink: data.bookingLink,
    active: data.active,
    createdAt: data.createdAt?.toMillis?.() ?? 0,
    updatedAt: data.updatedAt?.toMillis?.() ?? 0,
  }
}

export const getActiveServices = unstable_cache(
  async (): Promise<Service[]> => {
    const database = db()
    if (!database) return []
    const snap = await database.collection('services').get()
    const all = snap.docs.map(docToService)
    return filterActiveServices(all)
  },
  ['active-services'],
  { tags: ['services'], revalidate: 60 }
)

export async function getAllServicesAdmin(): Promise<Service[]> {
  const snap = await requireDb().collection('services').get()
  return snap.docs.map(docToService)
}

export async function getServiceById(id: string): Promise<Service | null> {
  const doc = await requireDb().collection('services').doc(id).get()
  if (!doc.exists) return null
  return docToService(doc)
}

export { filterActiveServices }
