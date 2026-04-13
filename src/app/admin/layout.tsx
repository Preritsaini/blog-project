import Link from 'next/link'
import { logout } from '@/actions/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-off-white)]">
      <header className="bg-[var(--color-indigo-deep)] text-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-serif text-xl font-semibold tracking-wide text-[var(--color-gold-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-soft)] rounded"
            >
              Prateeksha — Admin
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm text-white/80">
              <Link href="/admin/posts" className="hover:text-white transition-colors">Posts</Link>
              <Link href="/admin/services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/admin/media" className="hover:text-white transition-colors">Media</Link>
            </nav>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-soft)] rounded px-3 py-1.5 border border-white/20 hover:border-white/50 transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
