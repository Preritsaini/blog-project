/**
 * Unit tests for admin new service form
 * Validates: Requirements 8.2, 8.6
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock server actions
jest.mock('@/actions/services', () => ({
  createService: jest.fn(),
  deleteService: jest.fn(),
}))

// Mock useActionState
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, _action, false],
}))

import NewServicePage from './page'
import ConfirmDelete from '@/components/admin/ConfirmDelete'

describe('NewServicePage — Requirement 8.2: all required fields rendered', () => {
  beforeEach(() => {
    render(<NewServicePage />)
  })

  it('renders a name field', () => {
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
  })

  it('renders a description field', () => {
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
  })

  it('renders a duration field', () => {
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument()
  })

  it('renders a price field', () => {
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
  })

  it('renders a booking link field', () => {
    expect(screen.getByLabelText(/booking link/i)).toBeInTheDocument()
  })

  it('renders an active checkbox', () => {
    expect(screen.getByLabelText(/active/i)).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    expect(screen.getByRole('button', { name: /create service/i })).toBeInTheDocument()
  })
})

describe('ConfirmDelete — Requirement 8.6: delete calls action with correct ID', () => {
  it('calls onDelete with the correct service ID when confirmed', () => {
    const onDelete = jest.fn()
    render(<ConfirmDelete id="service-abc-123" onDelete={onDelete} />)

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    // Confirm deletion
    const dialog = screen.getByRole('dialog')
    const confirmButton = dialog.querySelector('button:last-child') as HTMLButtonElement
    fireEvent.click(confirmButton)

    expect(onDelete).toHaveBeenCalledWith('service-abc-123')
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('does not call onDelete when cancelled', () => {
    const onDelete = jest.fn()
    render(<ConfirmDelete id="service-xyz-456" onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onDelete).not.toHaveBeenCalled()
  })
})
