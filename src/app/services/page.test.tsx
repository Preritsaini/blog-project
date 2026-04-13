/**
 * Unit tests for services page empty state
 * Validates: Requirement 4.5
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('@/lib/firestore/services', () => ({
  getActiveServices: jest.fn(),
}))

jest.mock('server-only', () => ({}))

import { getActiveServices } from '@/lib/firestore/services'
import ServicesPage from './page'

const mockGetActiveServices = getActiveServices as jest.MockedFunction<typeof getActiveServices>

describe('ServicesPage — empty state', () => {
  it('shows empty state message when no services exist (Requirement 4.5)', async () => {
    mockGetActiveServices.mockResolvedValue([])

    const jsx = await ServicesPage()
    render(jsx)

    expect(screen.getByText(/services coming soon/i)).toBeInTheDocument()
  })

  it('renders service cards when services exist', async () => {
    const mockService = {
      id: 'svc-1',
      name: 'Psychic Reading',
      description: 'A one-on-one reading session.',
      duration: '60 minutes',
      price: '$150',
      bookingLink: 'https://example.com/book',
      active: true,
      createdAt: {
        toDate: () => new Date('2024-01-01'),
        toMillis: () => 1704067200000,
      } as unknown as import('firebase-admin/firestore').Timestamp,
      updatedAt: {
        toDate: () => new Date('2024-01-01'),
        toMillis: () => 1704067200000,
      } as unknown as import('firebase-admin/firestore').Timestamp,
    }

    mockGetActiveServices.mockResolvedValue([mockService])

    const jsx = await ServicesPage()
    render(jsx)

    expect(screen.getByText('Psychic Reading')).toBeInTheDocument()
    expect(screen.queryByText(/services coming soon/i)).not.toBeInTheDocument()
  })
})
