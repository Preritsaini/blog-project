'use client'

import { useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-[var(--color-indigo-deep)] text-[var(--color-off-white)] sticky top-0 z-40 shadow-sm" suppressHydrationWarning>
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-[var(--font-heading)] text-xl font-semibold tracking-wide text-[var(--color-gold-soft)]"
          onClick={() => setOpen(false)}
        >
          Soul Compass
        </Link>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-6 list-none m-0 p-0">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm font-medium text-[var(--color-off-white)] hover:text-[var(--color-gold-soft)] transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              className="rounded-md bg-[var(--color-gold-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-indigo-deep)] hover:opacity-90 transition-opacity"
            >
              Book Now
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden p-2 rounded-md text-[var(--color-off-white)] hover:bg-[var(--color-off-white)]/10 transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          suppressHydrationWarning
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" suppressHydrationWarning>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" suppressHydrationWarning>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="sm:hidden bg-[var(--color-indigo-deep)] border-t border-[var(--color-off-white)]/10 px-6 pb-6"
        >
          <ul className="flex flex-col gap-4 list-none m-0 p-0 pt-4">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block text-base font-medium text-[var(--color-off-white)] hover:text-[var(--color-gold-soft)] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="inline-block rounded-md bg-[var(--color-gold-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--color-indigo-deep)] hover:opacity-90 transition-opacity"
                onClick={() => setOpen(false)}
              >
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
