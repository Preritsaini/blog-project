'use client'

import { useActionState } from 'react'
import { submitContact, type ContactFormState } from '@/actions/contact'
import SubmitButton from './SubmitButton'

const initialState: ContactFormState = {}

const inputClass =
  'rounded-md border border-[var(--color-charcoal)]/15 bg-white px-4 py-2.5 text-sm text-[var(--color-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] placeholder:text-[var(--color-charcoal)]/30'

const labelClass = 'text-sm font-medium text-[var(--color-charcoal)]'

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState)

  if (state.success) {
    return (
      <div
        role="alert"
        className="rounded-xl bg-[var(--color-sage)]/15 border border-[var(--color-sage)]/40 p-6 text-[var(--color-plum-deep)]"
      >
        <p className="font-semibold">Message sent!</p>
        <p className="text-sm mt-1 opacity-80">
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          Name <span aria-hidden="true" className="text-[var(--color-lavender)]">*</span>
        </label>
        <input
          id="name" name="name" type="text" required
          aria-describedby={state.errors?.name ? 'name-error' : undefined}
          className={inputClass}
        />
        {state.errors?.name && (
          <p id="name-error" role="alert" className="text-xs text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          Email <span aria-hidden="true" className="text-[var(--color-lavender)]">*</span>
        </label>
        <input
          id="email" name="email" type="email" required
          aria-describedby={state.errors?.email ? 'email-error' : undefined}
          className={inputClass}
        />
        {state.errors?.email && (
          <p id="email-error" role="alert" className="text-xs text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className={labelClass}>
          Subject <span aria-hidden="true" className="text-[var(--color-lavender)]">*</span>
        </label>
        <input
          id="subject" name="subject" type="text" required
          aria-describedby={state.errors?.subject ? 'subject-error' : undefined}
          className={inputClass}
        />
        {state.errors?.subject && (
          <p id="subject-error" role="alert" className="text-xs text-red-600">{state.errors.subject[0]}</p>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClass}>
          Message <span aria-hidden="true" className="text-[var(--color-lavender)]">*</span>
        </label>
        <textarea
          id="message" name="message" rows={5} required
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
          className={`${inputClass} resize-y`}
        />
        {state.errors?.message && (
          <p id="message-error" role="alert" className="text-xs text-red-600">{state.errors.message[0]}</p>
        )}
      </div>

      <SubmitButton label="Send Message" pendingLabel="Sending…" />
    </form>
  )
}
