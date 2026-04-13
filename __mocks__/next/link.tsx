import React from 'react'

// Minimal mock for next/link
const Link = ({
  href,
  children,
  className,
  tabIndex,
  'aria-hidden': ariaHidden,
}: {
  href: string
  children: React.ReactNode
  className?: string
  tabIndex?: number
  'aria-hidden'?: boolean | 'true' | 'false'
}) => (
  <a href={href} className={className} tabIndex={tabIndex} aria-hidden={ariaHidden}>
    {children}
  </a>
)

export default Link
