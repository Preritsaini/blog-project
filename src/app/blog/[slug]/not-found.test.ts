/**
 * Unit test: /blog/[slug] with unknown slug renders 404
 * Validates: Requirement 3.4
 */

jest.mock('@/lib/firestore/posts', () => ({
  getPostBySlug: jest.fn(),
  getRelatedPosts: jest.fn(),
}))

jest.mock('server-only', () => ({}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

import { getPostBySlug } from '@/lib/firestore/posts'
import { notFound } from 'next/navigation'
import BlogPostPage from './page'

const mockGetPostBySlug = getPostBySlug as jest.MockedFunction<typeof getPostBySlug>
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>

describe('BlogPostPage — 404 behaviour', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNotFound.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND')
    })
  })

  it('calls notFound() when slug does not match any post (Requirement 3.4)', async () => {
    mockGetPostBySlug.mockResolvedValue(null)

    await expect(
      BlogPostPage({ params: Promise.resolve({ slug: 'unknown-slug' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND')

    expect(mockGetPostBySlug).toHaveBeenCalledWith('unknown-slug')
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('does not call notFound() when post exists', async () => {
    const mockPost = {
      id: 'post-1',
      title: 'Existing Post',
      slug: 'existing-post',
      excerpt: 'An excerpt.',
      body: '<p>Body content</p>',
      coverImage: 'https://example.com/cover.jpg',
      tags: ['spirituality'],
      published: true,
      publishedAt: {
        toDate: () => new Date('2024-06-01'),
        toMillis: () => 1717200000000,
      } as unknown as import('firebase-admin/firestore').Timestamp,
      createdAt: {
        toDate: () => new Date('2024-06-01'),
        toMillis: () => 1717200000000,
      } as unknown as import('firebase-admin/firestore').Timestamp,
      updatedAt: {
        toDate: () => new Date('2024-06-01'),
        toMillis: () => 1717200000000,
      } as unknown as import('firebase-admin/firestore').Timestamp,
    }

    const { getRelatedPosts } = jest.requireMock('@/lib/firestore/posts')
    mockGetPostBySlug.mockResolvedValue(mockPost)
    getRelatedPosts.mockResolvedValue([])

    // Should not throw
    await BlogPostPage({ params: Promise.resolve({ slug: 'existing-post' }) })

    expect(mockNotFound).not.toHaveBeenCalled()
  })
})
