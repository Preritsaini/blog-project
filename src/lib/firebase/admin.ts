import 'server-only'
import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app'

function getAdminApp(): App | null {
  if (getApps().length) return getApp()

  const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  
  if (privateKey) {
    // Handle cases where the key might be wrapped in quotes
    privateKey = privateKey.replace(/^['"]|['"]$/g, '')
    // Handle both literal newlines and escaped \n characters
    privateKey = privateKey.replace(/\\n/g, '\n')
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      '[AhanaFlow] Firebase Admin SDK env vars missing or incomplete.\n' +
      'Required: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY'
    )
    return null
  }

  try {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  } catch (err) {
    console.error('[AhanaFlow] Firebase Admin SDK init failed:', err)
    return null
  }
}

export const adminApp = getAdminApp()

/**
 * Returns a Firestore instance or throws a descriptive error.
 * Use this instead of calling getFirestore(adminApp) directly.
 */
export function requireAdminApp(): App {
  if (!adminApp) {
    throw new Error(
      'Firebase Admin SDK is not initialised. ' +
      'Make sure FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, ' +
      'and FIREBASE_ADMIN_PRIVATE_KEY are set in your .env.local file.'
    )
  }
  return adminApp
}
