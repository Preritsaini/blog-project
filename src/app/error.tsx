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
    // Log to an error reporting service in production
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-indigo-deep)] mb-3">
        Something went wrong
      </h1>
      <p className="text-[var(--color-charcoal)]/60 mb-8 max-w-sm">
        An unexpected error occurred. Please try again or return home.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-[var(--color-indigo-deep)] px-6 py-2.5 text-sm font-semibold text-[var(--color-off-white)] hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-[var(--color-indigo-deep)]/30 px-6 py-2.5 text-sm font-semibold text-[var(--color-indigo-deep)] hover:bg-[var(--color-indigo-deep)]/5 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
