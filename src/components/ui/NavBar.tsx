'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ClientOnly from '@/components/ui/ClientOnly'
import { MenuIcon, CloseIcon } from '@/components/ui/Icons'

const navLinks = [
  { href: '/about',    label: 'About'    },
  { href: '/blog',     label: 'Blog'     },
  { href: '/services', label: 'Services' },
  { href: '/contact',  label: 'Contact'  },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <header className="w-full bg-[var(--color-plum-deep)] text-[var(--color-cream)] sticky top-0 z-40 shadow-sm">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-[var(--font-heading)] text-2xl font-semibold tracking-wide text-[var(--color-gold)] hover:text-white transition-colors"
          onClick={() => setOpen(false)}
        >
          {/* Using mix-blend-screen to make the black background of the logo transparent */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/logo.png" 
            alt="AhanaFlow Logo" 
            className="w-10 h-10 object-contain mix-blend-screen scale-[1.2]" 
          />
          AhanaFlow
        </Link>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-6 list-none m-0 p-0">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm font-medium text-[var(--color-cream)]/80 hover:text-[var(--color-gold)] transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              className="rounded-md bg-[var(--color-sage)] px-4 py-2 text-sm font-semibold text-[var(--color-plum-deep)] hover:opacity-90 transition-opacity"
            >
              Book Now
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden p-2 rounded-md text-[var(--color-cream)] hover:bg-[var(--color-cream)]/10 transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <ClientOnly>
            {open ? <CloseIcon /> : <MenuIcon />}
          </ClientOnly>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="sm:hidden bg-[var(--color-plum-deep)] border-t border-[var(--color-cream)]/10 px-6 pb-6"
        >
          <ul className="flex flex-col gap-4 list-none m-0 p-0 pt-4">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block text-base font-medium text-[var(--color-cream)]/80 hover:text-[var(--color-gold)] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="inline-block rounded-md bg-[var(--color-sage)] px-5 py-2.5 text-sm font-semibold text-[var(--color-plum-deep)] hover:opacity-90 transition-opacity"
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
