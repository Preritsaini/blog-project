import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-6xl font-[var(--font-heading)] text-[var(--color-gold-soft)] mb-4">
        404
      </p>
      <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-indigo-deep)] mb-3">
        Page Not Found
      </h1>
      <p className="text-[var(--color-charcoal)]/60 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="rounded-md bg-[var(--color-indigo-deep)] px-6 py-2.5 text-sm font-semibold text-[var(--color-off-white)] hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-indigo-deep)]"
      >
        Return Home
      </Link>
    </div>
  )
}
