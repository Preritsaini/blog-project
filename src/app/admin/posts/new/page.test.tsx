/**
 * Unit tests for admin new post form
 * Validates: Requirements 7.2, 7.6
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock server actions
jest.mock('@/actions/posts', () => ({
  createPost: jest.fn(),
  deletePost: jest.fn(),
}))

// Mock PostEditor — ReactQuill requires a browser environment
jest.mock('@/components/admin/PostEditor', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="post-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

// Mock useActionState
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, _action, false],
}))

import NewPostPage from './page'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import { deletePost } from '@/actions/posts'

const mockDeletePost = deletePost as jest.MockedFunction<typeof deletePost>

describe('NewPostPage — Requirement 7.2: all required fields rendered', () => {
  beforeEach(() => {
    render(<NewPostPage />)
  })

  it('renders a title field', () => {
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
  })

  it('renders a slug field', () => {
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument()
  })

  it('renders an excerpt field', () => {
    expect(screen.getByLabelText(/excerpt/i)).toBeInTheDocument()
  })

  it('renders a cover image uploader', () => {
    // ImageUploader uses a <span> label + file input, not a <label htmlFor>
    expect(screen.getByText(/cover image/i)).toBeInTheDocument()
    expect(screen.getByText(/upload image/i)).toBeInTheDocument()
  })

  it('renders a tags field', () => {
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument()
  })

  it('renders the rich text body editor', () => {
    expect(screen.getByTestId('post-editor')).toBeInTheDocument()
  })

  it('renders a published checkbox', () => {
    expect(screen.getByLabelText(/publish immediately/i)).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument()
  })

  it('auto-generates slug from title', () => {
    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'Hello World Post' } })
    const slugInput = screen.getByLabelText(/slug/i) as HTMLInputElement
    expect(slugInput.value).toBe('hello-world-post')
  })
})

describe('ConfirmDelete — Requirement 7.6: delete calls action with correct ID', () => {
  it('calls onDelete with the correct post ID when confirmed', () => {
    const onDelete = jest.fn()
    render(<ConfirmDelete id="post-abc-123" onDelete={onDelete} />)

    // Click the Delete button to open dialog
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    // Confirm the deletion in the dialog (the confirm button is inside the dialog)
    const dialog = screen.getByRole('dialog')
    const confirmButton = dialog.querySelector('button:last-child') as HTMLButtonElement
    fireEvent.click(confirmButton)

    expect(onDelete).toHaveBeenCalledWith('post-abc-123')
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('does not call onDelete when cancelled', () => {
    const onDelete = jest.fn()
    render(<ConfirmDelete id="post-xyz-456" onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onDelete).not.toHaveBeenCalled()
  })
})
