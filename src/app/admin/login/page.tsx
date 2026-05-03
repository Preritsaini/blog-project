'use client'

import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '@/lib/firebase/client'
import { login } from '@/actions/auth'
import SubmitButton from '@/components/ui/SubmitButton'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const auth = getAuth(app)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()
      await login(idToken)
    } catch (err: any) {
      console.error('Login failed:', err)
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-plum-deep)] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-gold)]">
            AhanaFlow
          </p>
          <p className="text-sm text-[var(--color-cream)]/50 mt-1">Admin Panel</p>
        </div>

        <div className="bg-[var(--color-cream)] rounded-2xl p-8 shadow-xl">
          <h1 className="text-xl font-semibold text-[var(--color-plum-deep)] mb-6 text-center">
            Sign in to continue
          </h1>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {error && (
              <div role="alert" className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[var(--color-charcoal)]">
                Email
              </label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-[var(--color-charcoal)]/15 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[var(--color-charcoal)]">
                Password
              </label>
              <input
                id="password" name="password" type="password" required autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-[var(--color-charcoal)]/15 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)]"
              />
            </div>

            <SubmitButton
              label="Sign In"
              pendingLabel="Signing in…"
              isPending={loading}
              className="mt-2 w-full rounded-lg bg-[var(--color-plum-deep)] py-2.5 text-sm font-semibold text-[var(--color-cream)] hover:opacity-90 transition-opacity disabled:opacity-50"
            />
          </form>
        </div>
      </div>
    </main>
  )
}
