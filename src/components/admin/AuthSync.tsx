'use client'

import { useEffect } from 'react'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { app } from '@/lib/firebase/client'
import { getCustomToken } from '@/actions/auth'

/**
 * Ensures the client-side Firebase SDK is authenticated 
 * by syncing with the server-side session.
 */
export default function AuthSync() {
  useEffect(() => {
    const auth = getAuth(app)
    
    // If we already have a user, no need to sync
    if (auth.currentUser) return

    async function sync() {
      try {
        const token = await getCustomToken()
        if (token) {
          await signInWithCustomToken(auth, token)
          console.log('[AuthSync] Client-side auth synced.')
        }
      } catch (err) {
        console.error('[AuthSync] Failed to sync auth:', err)
      }
    }

    sync()
  }, [])

  return null
}
