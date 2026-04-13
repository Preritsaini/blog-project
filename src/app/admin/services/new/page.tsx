'use client'

import { useActionState } from 'react'
import { createService, type ServiceFormState } from '@/actions/services'
import SubmitButton from '@/components/ui/SubmitButton'

const initialState: ServiceFormState = {}

export default function NewServicePage() {
  const [state, formAction] = useActionState(createService, initialState)

  const inputClass =
    'rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]'
  const errorClass = 'mt-1 text-xs text-red-600'
  const labelClass = 'block text-sm font-medium text-[var(--color-charcoal)] mb-1'

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-[var(--color-indigo-deep)] mb-8">
        New Service
      </h1>

      <form action={formAction} className="flex flex-col gap-6 max-w-2xl">
        {state.serverError && (
          <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {state.serverError}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={inputClass}
          />
          {state.errors?.name && (
            <p className={errorClass}>{state.errors.name[0]}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={inputClass}
          />
          {state.errors?.description && (
            <p className={errorClass}>{state.errors.description[0]}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className={labelClass}>Duration</label>
          <input
            id="duration"
            name="duration"
            type="text"
            placeholder="e.g. 60 minutes"
            className={inputClass}
          />
          {state.errors?.duration && (
            <p className={errorClass}>{state.errors.duration[0]}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className={labelClass}>Price</label>
          <input
            id="price"
            name="price"
            type="text"
            placeholder="e.g. $150"
            className={inputClass}
          />
          {state.errors?.price && (
            <p className={errorClass}>{state.errors.price[0]}</p>
          )}
        </div>

        {/* Booking Link */}
        <div>
          <label htmlFor="bookingLink" className={labelClass}>Booking Link</label>
          <input
            id="bookingLink"
            name="bookingLink"
            type="text"
            placeholder="https://... or mailto:..."
            className={inputClass}
          />
          {state.errors?.bookingLink && (
            <p className={errorClass}>{state.errors.bookingLink[0]}</p>
          )}
        </div>

        {/* Active */}
        <div className="flex items-center gap-3">
          <input
            id="active"
            name="active"
            type="checkbox"
            value="true"
            className="h-4 w-4 rounded border-[var(--color-charcoal)]/20 text-[var(--color-indigo-deep)] focus:ring-[var(--color-indigo-deep)]"
          />
          <label htmlFor="active" className="text-sm font-medium text-[var(--color-charcoal)]">
            Active (visible on public site)
          </label>
        </div>

        <div>
          <SubmitButton label="Create Service" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  )
}
