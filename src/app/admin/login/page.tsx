'use client'

import { useActionState } from 'react'
import { login } from '@/actions/auth'
import SubmitButton from '@/components/ui/SubmitButton'

const initialState: { error?: string } = {}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(login, initialState)

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-off-white)] px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-serif font-semibold text-[var(--color-indigo-deep)] mb-8 text-center">
          Admin Login
        </h1>

        <form action={formAction} noValidate className="flex flex-col gap-5">
          {state?.error && (
            <div
              role="alert"
              className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700"
            >
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[var(--color-charcoal)]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--color-charcoal)]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]"
            />
          </div>

          <SubmitButton label="Sign In" pendingLabel="Signing in…" />
        </form>
      </div>
    </main>
  )
}
