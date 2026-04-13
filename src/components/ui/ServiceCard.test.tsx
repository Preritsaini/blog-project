/**
 * Property 9: Service card renders all required fields
 * Validates: Requirements 4.2
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ServiceCard from './ServiceCard'

const baseProps = {
  name: 'Intuitive Reading',
  description: 'A deep one-on-one session to explore your spiritual path.',
  duration: '60 minutes',
  price: '$150',
  bookingLink: 'https://calendly.com/prateeksha/reading',
}

describe('ServiceCard', () => {
  it('renders the service name', () => {
    render(<ServiceCard {...baseProps} />)
    expect(screen.getByText(baseProps.name)).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<ServiceCard {...baseProps} />)
    expect(screen.getByText(baseProps.description)).toBeInTheDocument()
  })

  it('renders the duration', () => {
    render(<ServiceCard {...baseProps} />)
    expect(screen.getByText(baseProps.duration)).toBeInTheDocument()
  })

  it('renders the price', () => {
    render(<ServiceCard {...baseProps} />)
    expect(screen.getByText(baseProps.price)).toBeInTheDocument()
  })

  it('renders a CTA link pointing to the booking link', () => {
    render(<ServiceCard {...baseProps} />)
    const link = screen.getByRole('link', { name: /book now/i })
    expect(link).toHaveAttribute('href', baseProps.bookingLink)
  })
})
