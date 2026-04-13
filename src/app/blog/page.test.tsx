/**
 * Unit tests for blog listing empty state
 * Validates: Requirement 2.5
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the Firestore module so we can control what getAllPosts returns
jest.mock('@/lib/firestore/posts', () => ({
  getAllPosts: jest.fn(),
}))

// Mock server-only so it doesn't throw in test environment
jest.mock('server-only', () => ({}))

import { getAllPosts } from '@/lib/firestore/posts'
import BlogListingPage from './page'

const mockGetAllPosts = getAllPosts as jest.MockedFunction<typeof getAllPosts>

describe('BlogListingPage — empty state', () => {
  it('shows empty state message when no posts exist (Requirement 2.5)', async () => {
    mockGetAllPosts.mockResolvedValue([])

    const jsx = await BlogListingPage()
    render(jsx)

    expect(
      screen.getByText(/no posts available yet/i)
    ).toBeInTheDocument()
  })

  it('renders blog cards when posts exist', async () => {
    const mockPost = {
      id: 'post-1',
      title: 'Test Post',
      slug: 'test-post',
      excerpt: 'A test excerpt',
      body: '<p>Body</p>',
      coverImage: 'https://example.com/cover.jpg',
      tags: ['test'],
      published: true,
      publishedAt: {
        toDate: () => new Date('2024-01-01'),
        toMillis: () => 1704067200000,
      } as unknown as import('firebase-admin/firestore').Timestamp,
      createdAt: {
        toDate: () => new Date('2024-01-01'),
        toMillis: () => 1704067200000,
      } as unknown as import('firebase-admin/firestore').Timestamp,
      updatedAt: {
        toDate: () => new Date('2024-01-01'),
        toMillis: () => 1704067200000,
      } as unknown as import('firebase-admin/firestore').Timestamp,
    }

    mockGetAllPosts.mockResolvedValue([mockPost])

    const jsx = await BlogListingPage()
    render(jsx)

    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.queryByText(/no posts available yet/i)).not.toBeInTheDocument()
  })
})
