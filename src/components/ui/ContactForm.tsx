'use client'

import { useActionState } from 'react'
import { submitContact, type ContactFormState } from '@/actions/contact'
import SubmitButton from './SubmitButton'

const initialState: ContactFormState = {}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState)

  if (state.success) {
    return (
      <div
        role="alert"
        className="rounded-lg bg-green-50 border border-green-200 p-6 text-green-800"
      >
        <p className="font-semibold">Message sent!</p>
        <p className="text-sm mt-1">
          Thank you for reaching out. Prateeksha will be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.serverError && (
        <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {state.serverError}
        </div>
      )}

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-[var(--color-charcoal)]">
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-describedby={state.errors?.name ? 'name-error' : undefined}
          className="rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]"
        />
        {state.errors?.name && (
          <p id="name-error" role="alert" className="text-xs text-red-600">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-charcoal)]">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-describedby={state.errors?.email ? 'email-error' : undefined}
          className="rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]"
        />
        {state.errors?.email && (
          <p id="email-error" role="alert" className="text-xs text-red-600">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1">
        <label htmlFor="subject" className="text-sm font-medium text-[var(--color-charcoal)]">
          Subject <span aria-hidden="true">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          aria-describedby={state.errors?.subject ? 'subject-error' : undefined}
          className="rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]"
        />
        {state.errors?.subject && (
          <p id="subject-error" role="alert" className="text-xs text-red-600">
            {state.errors.subject[0]}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-[var(--color-charcoal)]">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
          className="rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)] resize-y"
        />
        {state.errors?.message && (
          <p id="message-error" role="alert" className="text-xs text-red-600">
            {state.errors.message[0]}
          </p>
        )}
      </div>

      <SubmitButton label="Send Message" pendingLabel="Sending…" />
    </form>
  )
}
