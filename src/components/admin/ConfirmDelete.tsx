'use client'

import { useState } from 'react'

interface ConfirmDeleteProps {
  id: string
  onDelete: (id: string) => void
  label?: string
}

export default function ConfirmDelete({
  id,
  onDelete,
  label = 'Delete',
}: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
      >
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2
              id="confirm-delete-title"
              className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-plum-deep)] mb-3"
            >
              Confirm Delete
            </h2>
            <p className="text-sm text-[var(--color-charcoal)]/70 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-[var(--color-charcoal)]/20 px-4 py-2 text-sm hover:bg-[var(--color-mist)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(id)
                  setOpen(false)
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
