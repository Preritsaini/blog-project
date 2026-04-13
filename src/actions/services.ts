'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
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
  return getFirestore(adminApp)
}

function revalidateServicePaths() {
  revalidatePath('/services')
  revalidatePath('/')
}

export async function createService(
  prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string ?? '',
    duration: formData.get('duration') as string ?? '',
    price: formData.get('price') as string ?? '',
    bookingLink: formData.get('bookingLink') as string ?? '',
    active: formData.get('active') === 'true',
  }

  const result = ServiceSchema.safeParse(raw)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    const now = Timestamp.now()
    await db().collection('services').add({
      ...result.data,
      createdAt: now,
      updatedAt: now,
    })
  } catch {
    return { serverError: 'Something went wrong. Please try again.' }
  }

  revalidateServicePaths()
  redirect('/admin/services')
}

export async function updateService(
  id: string,
  prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string ?? '',
    duration: formData.get('duration') as string ?? '',
    price: formData.get('price') as string ?? '',
    bookingLink: formData.get('bookingLink') as string ?? '',
    active: formData.get('active') === 'true',
  }

  const result = ServiceSchema.safeParse(raw)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    await db().collection('services').doc(id).update({
      ...result.data,
      updatedAt: Timestamp.now(),
    })
  } catch {
    return { serverError: 'Something went wrong. Please try again.' }
  }

  revalidateServicePaths()
  redirect('/admin/services')
}

export async function deleteService(id: string): Promise<void> {
  await db().collection('services').doc(id).delete()
  revalidateServicePaths()
  redirect('/admin/services')
}
