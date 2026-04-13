/**
 * Unit tests for Admin Login page — field presence
 * Validates: Requirement 6.1
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the server action
jest.mock('@/actions/auth', () => ({
  login: jest.fn(),
}))

// Mock useActionState to return a static initial state
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (action: unknown, initialState: unknown) => [initialState, action, false],
}))

import AdminLoginPage from './page'

describe('AdminLoginPage', () => {
  it('renders an email input field', () => {
    render(<AdminLoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email')
  })

  it('renders a password input field', () => {
    render(<AdminLoginPage />)
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password')
  })

  it('renders a submit button', () => {
    render(<AdminLoginPage />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})
