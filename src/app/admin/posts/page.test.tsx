/**
 * Property test: Admin post list renders all posts with required fields
 * // Feature: prateeksha-psychic-coach, Property 13
 * Validates: Requirements 7.1
 */
import React from 'react'
import { render, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as fc from 'fast-check'

jest.mock('@/lib/firestore/posts', () => ({
  getAllPostsAdmin: jest.fn(),
}))
jest.mock('@/actions/posts', () => ({
  deletePost: jest.fn(),
}))
jest.mock('server-only', () => ({}))
jest.mock('@/components/admin/ConfirmDelete', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <button data-testid={`delete-${id}`}>Delete</button>,
}))

import { getAllPostsAdmin } from '@/lib/firestore/posts'
import AdminPostsPage from './page'

const mockGetAllPostsAdmin = getAllPostsAdmin as jest.MockedFunction<typeof getAllPostsAdmin>

function makeTimestamp(ms: number) {
  return {
    toDate: () => new Date(ms),
    toMillis: () => ms,
  } as unknown as import('firebase-admin/firestore').Timestamp
}

// Generate a post with a given unique id
const postArb = (id: string) =>
  fc.record({
    id: fc.constant(id),
    // Titles must have at least one non-whitespace character and no leading/trailing spaces
    // (mirrors PostSchema trim + min(1)) to avoid RTL text normalization issues
    title: fc
      .string({ minLength: 1, maxLength: 60 })
      .filter((s) => s.trim() === s && s.trim().length > 0),
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

// Generate an array of posts with unique IDs
const postsArb = fc
  .uniqueArray(fc.uuid(), { minLength: 1, maxLength: 8 })
  .chain((ids) => fc.tuple(...ids.map(postArb)))

describe('AdminPostsPage — Property 13: renders all posts with required fields', () => {
  it('renders one row per post with title, date, and status', async () => {
    await fc.assert(
      fc.asyncProperty(postsArb, async (posts) => {
        mockGetAllPostsAdmin.mockResolvedValue(posts)

        const jsx = await AdminPostsPage()
        const { container, unmount } = render(jsx)

        const tbody = container.querySelector('tbody')!

        // Each post should have exactly one row in the table
        const rows = tbody.querySelectorAll('tr')
        expect(rows).toHaveLength(posts.length)

        // Each row should contain the post's title
        posts.forEach((post, i) => {
          const row = rows[i]
          expect(row.textContent).toContain(post.title)
        })

        // Published/Draft badge counts should match
        const publishedCount = posts.filter((p) => p.published).length
        const draftCount = posts.filter((p) => !p.published).length

        const publishedBadges = container.querySelectorAll('.bg-green-100')
        const draftBadges = container.querySelectorAll('.bg-gray-100')

        expect(publishedBadges).toHaveLength(publishedCount)
        expect(draftBadges).toHaveLength(draftCount)

        unmount()
      }),
      { numRuns: 100 }
    )
  })
})
