import 'server-only'
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app'

function getAdminApp() {
  if (getApps().length) return getApp()

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey || privateKey.includes('YOUR_PRIVATE_KEY_HERE')) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Firebase Admin SDK credentials missing or incomplete. ' +
        'Server-side Firebase features (Admin, Firestore) will be unavailable. ' +
        'Check your .env.local file.'
      )
    }
    return null
  }

  try {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error)
    return null
  }
}

const adminApp = getAdminApp()

export { adminApp }
