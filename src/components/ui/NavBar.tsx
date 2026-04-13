import Link from 'next/link'

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export default function NavBar() {
  return (
    <header className="w-full bg-[var(--color-indigo-deep)] text-[var(--color-off-white)]">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-[var(--font-heading)] text-xl font-semibold tracking-wide text-[var(--color-gold-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-soft)]"
        >
          Prateeksha
        </Link>

        <ul className="flex items-center gap-6 list-none m-0 p-0">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm font-medium text-[var(--color-off-white)] hover:text-[var(--color-gold-soft)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-soft)] rounded-sm"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
