'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-[var(--color-cream)] flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-plum-deep)] mb-3">
        Something went wrong
      </h1>
      <p className="text-[var(--color-charcoal)]/55 mb-8 max-w-sm">
        An unexpected error occurred. Please try again or return home.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-[var(--color-plum-deep)] px-6 py-2.5 text-sm font-semibold text-[var(--color-cream)] hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-[var(--color-plum-deep)]/25 px-6 py-2.5 text-sm font-semibold text-[var(--color-plum-deep)] hover:bg-[var(--color-plum-deep)]/5 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
