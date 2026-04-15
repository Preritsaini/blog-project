import Link from 'next/link'
import { siteConfig } from '@/lib/config'

const navLinks = [
  { href: '/about',    label: 'About'    },
  { href: '/blog',     label: 'Blog'     },
  { href: '/services', label: 'Services' },
  { href: '/contact',  label: 'Contact'  },
]

const socialLinks = [
  { href: siteConfig.links.instagram, label: 'Instagram' },
  { href: siteConfig.links.twitter,   label: 'Twitter / X' },
  { href: siteConfig.links.facebook,  label: 'Facebook' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-[var(--color-plum-deep)] text-[var(--color-cream)] mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-gold)] hover:opacity-80 transition-opacity"
          >
            {siteConfig.name}
          </Link>
          <p className="mt-2 text-sm text-[var(--color-cream)]/55 leading-relaxed">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-cream)]/35 mb-3">
            Navigate
          </p>
          <ul className="flex flex-col gap-2 list-none m-0 p-0">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[var(--color-cream)]/65 hover:text-[var(--color-gold)] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social links */}
        <nav aria-label="Social media links">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-cream)]/35 mb-3">
            Follow
          </p>
          <ul className="flex flex-col gap-2 list-none m-0 p-0">
            {socialLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-cream)]/65 hover:text-[var(--color-gold)] transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-[var(--color-cream)]/10 py-5 text-center text-xs text-[var(--color-cream)]/35">
        &copy; {year} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  )
}
