import Link from 'next/link'
import { logout } from '@/actions/auth'

// ─── SSR: admin is always fresh — never cache ─────────────────────────────────
export const dynamic = 'force-dynamic'
export const revalidate = 0

const navLinks = [
  { href: '/admin',          label: 'Dashboard' },
  { href: '/admin/posts',    label: 'Posts'     },
  { href: '/admin/services', label: 'Services'  },
  { href: '/admin/contacts', label: 'Contacts'  },
  { href: '/admin/media',    label: 'Media'     },
  { href: '/admin/settings', label: 'Settings'  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-mist)]">
      <header className="bg-[var(--color-plum-deep)] text-[var(--color-cream)] sticky top-0 z-40 shadow-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-gold)]"
            >
              Soul Compass
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded-md text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-cream)] hover:bg-[var(--color-cream)]/10 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[var(--color-cream)]/50 hover:text-[var(--color-cream)]/80 transition-colors"
            >
              View site ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-cream)] border border-[var(--color-cream)]/20 hover:border-[var(--color-cream)]/40 rounded-md px-3 py-1.5 transition-colors"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
