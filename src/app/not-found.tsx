import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="bg-[var(--color-cream)] flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <p
        aria-hidden="true"
        className="font-[var(--font-heading)] text-8xl font-semibold text-[var(--color-lavender)]/20 mb-2 select-none"
      >
        404
      </p>
      <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-plum-deep)] mb-3">
        This Page Has Moved On
      </h1>
      <p className="text-[var(--color-charcoal)]/55 mb-10 max-w-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist here anymore — but your path forward does.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/"
          className="rounded-md bg-[var(--color-plum-deep)] px-6 py-2.5 text-sm font-semibold text-[var(--color-cream)] hover:opacity-90 transition-opacity"
        >
          Return Home
        </a>
        <a
          href="/contact"
          className="rounded-md border border-[var(--color-plum-deep)]/25 px-6 py-2.5 text-sm font-semibold text-[var(--color-plum-deep)] hover:bg-[var(--color-plum-deep)]/5 transition-colors"
        >
          Book a Session
        </a>
      </div>
      <p className="mt-10 text-xs text-[var(--color-charcoal)]/30">
        {siteConfig.name} · {siteConfig.tagline}
      </p>
    </div>
  )
}
