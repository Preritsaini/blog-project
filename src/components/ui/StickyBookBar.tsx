'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Appears on mobile after scrolling 400px.
 * Hidden on /contact and /admin routes.
 */
export default function StickyBookBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show on contact or admin pages
    if (
      window.location.pathname.startsWith('/contact') ||
      window.location.pathname.startsWith('/admin')
    ) return

    function onScroll() {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2"
      style={{
        background: 'linear-gradient(to top, var(--color-cream) 70%, transparent)',
        animation: 'slideUp 0.3s ease both',
      }}
    >
      <Link
        href="/contact"
        className="block w-full rounded-xl bg-[var(--color-plum-deep)] py-3.5 text-center text-sm font-semibold text-[var(--color-cream)] shadow-lg hover:opacity-90 transition-opacity active:scale-95"
      >
        Book a Session with Prateeksha
      </Link>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
