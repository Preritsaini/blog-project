import Link from 'next/link'

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://twitter.com', label: 'Twitter / X' },
  { href: 'https://facebook.com', label: 'Facebook' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-[var(--color-indigo-deep)] text-[var(--color-off-white)] mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Brand */}
        <div>
          <p className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-gold-soft)]">
            Prateeksha
          </p>
          <p className="mt-1 text-xs text-[var(--color-off-white)]/70">
            Psychic coaching &amp; spiritual guidance
          </p>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-col gap-2 list-none m-0 p-0">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[var(--color-off-white)]/80 hover:text-[var(--color-gold-soft)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-soft)] rounded-sm"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social links */}
        <nav aria-label="Social media links">
          <ul className="flex flex-col gap-2 list-none m-0 p-0">
            {socialLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-off-white)]/80 hover:text-[var(--color-gold-soft)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-soft)] rounded-sm"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-[var(--color-off-white)]/10 py-4 text-center text-xs text-[var(--color-off-white)]/50">
        &copy; {year} Prateeksha. All rights reserved.
      </div>
    </footer>
  )
}
