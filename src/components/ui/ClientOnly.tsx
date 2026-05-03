'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * Hydration-safe wrapper to ensure children only render on the client.
 */
export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const isServer = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true
  )

  if (isServer) {
    return null
  }

  return <>{children}</>
}

