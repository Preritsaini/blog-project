import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Missing Firebase Admin credentials in .env.local')
  process.exit(1)
}

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })

const auth = getAuth(app)

async function resetAdmin() {
  const email = 'superadmin@gmail.com'
  const newPassword = 'superadmin'

  try {
    const user = await auth.getUserByEmail(email)
    await auth.updateUser(user.uid, {
      password: newPassword,
    })
    console.log(`✅ Password successfully reset for ${email}`)
    
    // Also ensure admin claim is set
    await auth.setCustomUserClaims(user.uid, { admin: true })
    console.log('✅ Admin custom claims verified')
    
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log(`❌ User ${email} not found. Creating it instead...`)
      const userRecord = await auth.createUser({
        email: email,
        password: newPassword,
        displayName: 'Super Admin',
      })
      await auth.setCustomUserClaims(userRecord.uid, { admin: true })
      console.log(`✅ Created Super Admin user: ${userRecord.uid}`)
    } else {
      console.error('❌ Error resetting admin:', error)
    }
  }
  process.exit(0)
}

resetAdmin()
