'use server'

import { saveContact } from '@/lib/firestore/contacts'
import { ContactSchema } from '@/lib/validations'

export interface ContactFormState {
  errors?: {
    name?: string[]
    email?: string[]
    subject?: string[]
    message?: string[]
  }
  success?: boolean
  serverError?: string
}

export async function submitContact(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
  }

  const result = ContactSchema.safeParse(raw)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    await saveContact(result.data)
  } catch {
    return { serverError: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
