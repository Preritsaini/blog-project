'use server'

import { redirect } from 'next/navigation'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { app } from '@/lib/firebase/client'
import { createSession, deleteSession, verifySession } from '@/lib/session'
import { getAuth as getAdminAuth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin'

export async function login(idToken: string): Promise<void> {
  try {
    await createSession(idToken)
  } catch (err: unknown) {
    console.error('Session creation failed:', err)
    throw new Error('Authentication failed')
  }

  redirect('/admin')
}

export async function logout(): Promise<never> {
  await deleteSession()
  redirect('/admin/login')
}

export async function getCustomToken(): Promise<string | null> {
  const session = await verifySession()
  if (!session || !adminApp) return null

  try {
    const token = await getAdminAuth(adminApp).createCustomToken(session.uid)
    return token
  } catch (err) {
    console.error('Failed to create custom token:', err)
    return null
  }
}
