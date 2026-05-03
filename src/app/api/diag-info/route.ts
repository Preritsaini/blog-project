import { NextResponse } from 'next/server'
import { adminApp } from '@/lib/firebase/admin'

export async function GET() {
  return NextResponse.json({
    env: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING',
      adminProjectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'MISSING',
      hasPrivateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      privateKeyLength: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.length || 0,
      hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    },
    adminAppInitialized: !!adminApp,
    timestamp: new Date().toISOString()
  })
}
