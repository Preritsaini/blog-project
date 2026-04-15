'use server'

import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import { ServiceSchema } from '@/lib/validations'

export interface ServiceFormState {
  errors?: {
    name?: string[]
    description?: string[]
    duration?: string[]
    price?: string[]
    bookingLink?: string[]
    active?: string[]
  }
  serverError?: string
}

function db() {
  if (!adminApp) {
    throw new Error('Firebase Admin SDK is not initialised. Check your .env.local file.')
  }
  return getFirestore(adminApp)
}

function revalidateServices() {
  revalidateTag('services')
  revalidatePath('/services')
  revalidatePath('/')
}

export async function createService(
  prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const raw = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) ?? '',
    duration: (formData.get('duration') as string) ?? '',
    price: (formData.get('price') as string) ?? '',
    bookingLink: (formData.get('bookingLink') as string) ?? '',
    active: formData.get('active') === 'true',
  }

  const result = ServiceSchema.safeParse(raw)
  if (!result.success) return { errors: result.error.flatten().fieldErrors }

  try {
    const now = Timestamp.now()
    await db().collection('services').add({ ...result.data, createdAt: now, updatedAt: now })
  } catch {
    return { serverError: 'Something went wrong. Please try again.' }
  }

  revalidateServices()
  redirect('/admin/services')
}

export async function updateService(
  id: string,
  prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const raw = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) ?? '',
    duration: (formData.get('duration') as string) ?? '',
    price: (formData.get('price') as string) ?? '',
    bookingLink: (formData.get('bookingLink') as string) ?? '',
    active: formData.get('active') === 'true',
  }

  const result = ServiceSchema.safeParse(raw)
  if (!result.success) return { errors: result.error.flatten().fieldErrors }

  try {
    await db().collection('services').doc(id).update({ ...result.data, updatedAt: Timestamp.now() })
  } catch {
    return { serverError: 'Something went wrong. Please try again.' }
  }

  revalidateServices()
  redirect('/admin/services')
}

export async function deleteService(id: string): Promise<void> {
  await db().collection('services').doc(id).delete()
  revalidateServices()
  redirect('/admin/services')
}
