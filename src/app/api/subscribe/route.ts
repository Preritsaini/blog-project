import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (!adminApp) {
      throw new Error('Firebase Admin SDK not configured')
    }
    const db = getFirestore(adminApp)

    // Upsert — avoid duplicates
    const existing = await db
      .collection('subscribers')
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get()

    if (existing.empty) {
      await db.collection('subscribers').add({
        email: email.toLowerCase().trim(),
        subscribedAt: Timestamp.now(),
        source: 'blog',
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('subscribe error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
