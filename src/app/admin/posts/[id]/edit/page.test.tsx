/**
 * Property test: Edit form is pre-populated with stored data
 * // Feature: prateeksha-psychic-coach, Property 15
 * Validates: Requirements 7.4
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as fc from 'fast-check'

// Mock server-only and Firestore
jest.mock('server-only', () => ({}))
jest.mock('@/lib/firestore/posts', () => ({
  getPostById: jest.fn(),
}))
jest.mock('@/actions/posts', () => ({
  updatePost: jest.fn(),
}))
// Mock next/navigation notFound
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
}))
// Mock PostEditor — ReactQuill requires a browser environment
jest.mock('@/components/admin/PostEditor', () => ({
  __esModule: true,
  default: ({ value }: { value: string }) => (
    <textarea data-testid="post-editor" defaultValue={value} readOnly />
  ),
}))
// Mock useActionState
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, _action, false],
}))

import EditPostForm from './EditPostForm'

function makeTimestamp(ms: number) {
  return {
    toDate: () => new Date(ms),
    toMillis: () => ms,
  } as unknown as import('firebase-admin/firestore').Timestamp
}

const postArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 80 }),
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{0,40}$/),
  excerpt: fc.string({ maxLength: 200 }),
  body: fc.string({ maxLength: 500 }),
  coverImage: fc.constant(''),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 5 }),
  published: fc.boolean(),
  publishedAt: fc.integer({ min: 0, max: 2_000_000_000_000 }).map(makeTimestamp),
  createdAt: fc.integer({ min: 0, max: 2_000_000_000_000 }).map(makeTimestamp),
  updatedAt: fc.integer({ min: 0, max: 2_000_000_000_000 }).map(makeTimestamp),
})

describe('EditPostForm — Property 15: pre-populated with stored data', () => {
  it('renders form fields with values matching the stored post', () => {
    fc.assert(
      fc.property(postArb, (post) => {
        const { unmount } = render(<EditPostForm post={post} />)

        // Title input should have the post's title as default value
        const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement
        expect(titleInput.defaultValue).toBe(post.title)

        // Slug input should have the post's slug
        const slugInput = screen.getByLabelText(/slug/i) as HTMLInputElement
        expect(slugInput.value).toBe(post.slug)

        // Excerpt textarea should have the post's excerpt
        const excerptInput = screen.getByLabelText(/excerpt/i) as HTMLTextAreaElement
        expect(excerptInput.defaultValue).toBe(post.excerpt)

        // Tags input should have the post's tags as comma-separated string
        const tagsInput = screen.getByLabelText(/tags/i) as HTMLInputElement
        expect(tagsInput.defaultValue).toBe(post.tags.join(', '))

        // Published checkbox should reflect the post's published state
        const publishedCheckbox = screen.getByLabelText(/published/i) as HTMLInputElement
        expect(publishedCheckbox.defaultChecked).toBe(post.published)

        // Body editor should have the post's body
        const bodyEditor = screen.getByTestId('post-editor') as HTMLTextAreaElement
        expect(bodyEditor.defaultValue).toBe(post.body)

        unmount()
      }),
      { numRuns: 100 }
    )
  })
})
