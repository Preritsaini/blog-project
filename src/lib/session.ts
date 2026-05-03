import 'server-only'
import { cookies } from 'next/headers'
import { getAuth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin'

const SESSION_COOKIE_NAME = '__session'
const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000 // 5 days

export async function createSession(idToken: string): Promise<void> {
  if (!adminApp) throw new Error('Firebase Admin SDK not configured')
  const expiresIn = SESSION_DURATION_MS
  const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: expiresIn / 1000, // maxAge is in seconds
    path: '/',
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function verifySession(): Promise<import('firebase-admin/auth').DecodedIdToken | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!cookie || !adminApp) return null

  try {
    const decoded = await getAuth(adminApp).verifySessionCookie(cookie, true)
    return decoded
  } catch (err) {
    console.error('Session verification failed:', err)
    return null
  }
}
