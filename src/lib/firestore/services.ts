import 'server-only'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import { filterActiveServices, type Service } from './utils'

export type { Service }

function db() {
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
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

/** Fetches services where active === true. */
export async function getActiveServices(): Promise<Service[]> {
  const snap = await db()
    .collection('services')
    .where('active', '==', true)
    .get()
  return snap.docs.map(docToService)
}

/** Fetches all services for the admin list. */
export async function getAllServicesAdmin(): Promise<Service[]> {
  const snap = await db().collection('services').get()
  return snap.docs.map(docToService)
}

/** Fetches a single service by Firestore document ID. */
export async function getServiceById(id: string): Promise<Service | null> {
  const doc = await db().collection('services').doc(id).get()
  if (!doc.exists) return null
  return docToService(doc)
}

// Re-export pure helper for consumers
export { filterActiveServices }
