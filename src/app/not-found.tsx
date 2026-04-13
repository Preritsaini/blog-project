import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <p
        aria-hidden="true"
        className="font-[var(--font-heading)] text-8xl font-semibold text-[var(--color-gold-soft)]/40 mb-2 select-none"
      >
        404
      </p>
      <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-indigo-deep)] mb-3">
        Page Not Found
      </h1>
      <p className="text-[var(--color-charcoal)]/60 mb-10 max-w-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="rounded-md bg-[var(--color-indigo-deep)] px-6 py-2.5 text-sm font-semibold text-[var(--color-off-white)] hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
        <Link
          href="/blog"
          className="rounded-md border border-[var(--color-indigo-deep)]/30 px-6 py-2.5 text-sm font-semibold text-[var(--color-indigo-deep)] hover:bg-[var(--color-indigo-deep)]/5 transition-colors"
        >
          Browse Blog
        </Link>
      </div>
      <p className="mt-8 text-xs text-[var(--color-charcoal)]/40">
        {siteConfig.name} · {siteConfig.tagline}
      </p>
    </div>
  )
}
