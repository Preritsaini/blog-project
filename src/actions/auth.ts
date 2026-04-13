'use server'

import { redirect } from 'next/navigation'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { app } from '@/lib/firebase/client'
import { createSession, deleteSession } from '@/lib/session'

export async function login(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const clientAuth = getAuth(app)
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password)
    const idToken = await userCredential.user.getIdToken()
    await createSession(idToken)
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code ?? ''
    // Map all Firebase Auth errors to a generic message to avoid leaking info
    if (
      code.startsWith('auth/') ||
      code === 'auth/wrong-password' ||
      code === 'auth/user-not-found' ||
      code === 'auth/invalid-credential' ||
      code === 'auth/invalid-email' ||
      code === 'auth/too-many-requests'
    ) {
      return { error: 'Invalid email or password' }
    }
    return { error: 'Invalid email or password' }
  }

  redirect('/admin')
}

export async function logout(): Promise<never> {
  await deleteSession()
  redirect('/admin/login')
}
