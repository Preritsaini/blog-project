'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  label?: string
  pendingLabel?: string
  className?: string
}

export default function SubmitButton({
  label = 'Submit',
  pendingLabel = 'Submitting…',
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={
        className ??
        'inline-flex items-center justify-center rounded-md bg-[var(--color-indigo-deep)] px-6 py-2.5 text-sm font-semibold text-[var(--color-off-white)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-indigo-deep)]'
      }
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
