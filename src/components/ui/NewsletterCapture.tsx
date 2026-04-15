'use client'

import { useState } from 'react'

/**
 * Inline email capture — saves to Firestore `subscribers` collection
 * via a lightweight Server Action.
 */
export default function NewsletterCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        role="alert"
        className="rounded-2xl bg-[var(--color-sage)]/15 border border-[var(--color-sage)]/30 px-8 py-6 text-center"
        style={{ animation: 'fadeIn 0.4s ease both' }}
      >
        <p className="font-[var(--font-heading)] text-xl text-[var(--color-plum-deep)] mb-1">
          You&apos;re in ✦
        </p>
        <p className="text-sm text-[var(--color-charcoal)]/60">
          Prateeksha&apos;s next piece lands in your inbox.
        </p>
        <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }`}</style>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-[var(--color-plum-deep)] px-8 py-10 text-center">
      <p className="text-[var(--color-gold)] text-xs font-semibold uppercase tracking-widest mb-3">
        Stay Connected
      </p>
      <h3 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-cream)] mb-2">
        New posts, straight to your inbox
      </h3>
      <p className="text-[var(--color-cream)]/55 text-sm mb-6">
        No spam. Just Prateeksha&apos;s latest writing on intuition, healing, and living with purpose.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--color-cream)]/20 bg-[var(--color-cream)]/10 px-4 py-2.5 text-sm text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-[var(--color-sage)] px-5 py-2.5 text-sm font-semibold text-[var(--color-plum-deep)] hover:opacity-90 transition-opacity disabled:opacity-50 active:scale-95"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-3 text-xs text-red-300">Something went wrong — please try again.</p>
      )}
    </div>
  )
}
