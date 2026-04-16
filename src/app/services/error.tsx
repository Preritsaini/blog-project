'use client'

import { useEffect } from 'react'

export default function ServicesError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="font-[var(--font-heading)] text-2xl text-[var(--color-plum-deep)] mb-3">
        Couldn&apos;t load services
      </p>
      <p className="text-[var(--color-charcoal)]/55 mb-6 text-sm">
        There was a problem fetching services. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-[var(--color-plum-deep)] px-6 py-2.5 text-sm font-semibold text-[var(--color-cream)] hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  )
}
