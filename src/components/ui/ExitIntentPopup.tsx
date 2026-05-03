'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Exit-intent popup — fires once per session when the mouse
 * moves toward the top of the viewport (desktop) or after
 * 45 seconds of inactivity (mobile fallback).
 *
 * Dismissed state is stored in sessionStorage so it only
 * shows once per browser session.
 */
export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    if (sessionStorage.getItem('exit-popup-dismissed')) return

    let timer: ReturnType<typeof setTimeout>

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 20) {
        setShow(true)
        cleanup()
      }
    }

    // Mobile fallback: show after 45s
    timer = setTimeout(() => {
      if (!sessionStorage.getItem('exit-popup-dismissed')) {
        setShow(true)
        cleanup()
      }
    }, 45_000)

    document.addEventListener('mouseleave', handleMouseLeave)

    function cleanup() {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timer)
    }

    return cleanup
  }, [])

  function dismiss() {
    sessionStorage.setItem('exit-popup-dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(74,54,90,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div
        className="popup-card relative w-full max-w-md rounded-2xl bg-[var(--color-cream)] p-8 shadow-2xl"
        style={{ animation: 'popupIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-[var(--color-charcoal)]/30 hover:text-[var(--color-charcoal)]/70 transition-colors text-xl leading-none"
        >
          ✕
        </button>

        <p className="text-[var(--color-gold)] text-xs font-semibold uppercase tracking-widest mb-3">
          Before you go
        </p>
        <h2
          id="popup-title"
          className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-plum-deep)] mb-3 leading-tight"
        >
          Get a Free 3-Card Reading
        </h2>
        <p className="text-[var(--color-charcoal)]/65 text-sm leading-relaxed mb-6">
          Not sure if this is right for you? Book a complimentary 15-minute intro call with Prateeksha — no commitment, no pressure. Just a conversation.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/contact?offer=free-reading"
            onClick={dismiss}
            className="block w-full rounded-lg bg-[var(--color-plum-deep)] py-3 text-center text-sm font-semibold text-[var(--color-cream)] hover:opacity-90 transition-opacity"
          >
            Claim My Free Reading
          </Link>
          <button
            onClick={dismiss}
            className="text-xs text-[var(--color-charcoal)]/35 hover:text-[var(--color-charcoal)]/60 transition-colors"
          >
            No thanks, I&apos;ll pass
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .popup-card { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
