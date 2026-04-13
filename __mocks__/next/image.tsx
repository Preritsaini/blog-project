import React from 'react'

// Minimal mock for next/image
const Image = ({
  src,
  alt,
  fill: _fill,
  sizes: _sizes,
  className,
  width,
  height,
}: {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  className?: string
  width?: number
  height?: number
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} className={className} width={width} height={height} />
)

export default Image
