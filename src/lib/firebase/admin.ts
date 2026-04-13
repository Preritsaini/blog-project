import 'server-only'
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app'

const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    // Newlines in env vars are escaped — restore them
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
}

// Avoid re-initialising across hot reloads in dev
const adminApp = getApps().length ? getApp() : initializeApp(adminConfig)

export { adminApp }
