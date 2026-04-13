/**
 * Property test: Edit form is pre-populated with stored data (services)
 * // Feature: prateeksha-psychic-coach, Property 15
 * Validates: Requirements 8.4
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as fc from 'fast-check'

// Mock server-only and Firestore
jest.mock('server-only', () => ({}))
jest.mock('@/lib/firestore/services', () => ({
  getServiceById: jest.fn(),
}))
jest.mock('@/actions/services', () => ({
  updateService: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
}))
// Mock useActionState
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, _action, false],
}))

import EditServiceForm from './EditServiceForm'

function makeTimestamp(ms: number) {
  return {
    toDate: () => new Date(ms),
    toMillis: () => ms,
  } as unknown as import('firebase-admin/firestore').Timestamp
}

const serviceArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 80 }),
  description: fc.string({ maxLength: 300 }),
  duration: fc.string({ maxLength: 50 }),
  price: fc.string({ maxLength: 50 }),
  bookingLink: fc.string({ maxLength: 200 }),
  active: fc.boolean(),
  createdAt: fc.integer({ min: 0, max: 2_000_000_000_000 }).map(makeTimestamp),
  updatedAt: fc.integer({ min: 0, max: 2_000_000_000_000 }).map(makeTimestamp),
})

describe('EditServiceForm — Property 15: pre-populated with stored data', () => {
  it('renders form fields with values matching the stored service', () => {
    fc.assert(
      fc.property(serviceArb, (service) => {
        const { unmount } = render(<EditServiceForm service={service} />)

        // Name input should have the service's name as default value
        const nameInput = screen.getByLabelText(/^name$/i) as HTMLInputElement
        expect(nameInput.defaultValue).toBe(service.name)

        // Description textarea should have the service's description
        const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement
        expect(descriptionInput.defaultValue).toBe(service.description)

        // Duration input should have the service's duration
        const durationInput = screen.getByLabelText(/duration/i) as HTMLInputElement
        expect(durationInput.defaultValue).toBe(service.duration)

        // Price input should have the service's price
        const priceInput = screen.getByLabelText(/price/i) as HTMLInputElement
        expect(priceInput.defaultValue).toBe(service.price)

        // Booking link input should have the service's bookingLink
        const bookingLinkInput = screen.getByLabelText(/booking link/i) as HTMLInputElement
        expect(bookingLinkInput.defaultValue).toBe(service.bookingLink)

        // Active checkbox should reflect the service's active state
        const activeCheckbox = screen.getByLabelText(/active/i) as HTMLInputElement
        expect(activeCheckbox.defaultChecked).toBe(service.active)

        unmount()
      }),
      { numRuns: 100 }
    )
  })
})
