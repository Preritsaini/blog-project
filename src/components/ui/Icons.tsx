import React, { forwardRef } from 'react'

/**
 * Icons used in the admin panel. 
 */
export function UploadIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-4 w-4" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" 
      />
    </svg>
  )
}

export function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

interface UploadButtonProps {
  label: string
  className: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  multiple?: boolean
}

export const UploadButton = forwardRef<HTMLInputElement, UploadButtonProps>(
  ({ label, className, onChange, disabled, multiple }, ref) => {
    return (
      <label className={className}>
        <UploadIcon />
        {label}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="sr-only"
          onChange={onChange}
          disabled={disabled}
        />
      </label>
    )
  }
)

UploadButton.displayName = 'UploadButton'


