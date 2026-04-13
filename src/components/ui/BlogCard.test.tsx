/**
 * Property 4: Blog post card renders all required fields
 * Validates: Requirements 2.2
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogCard from './BlogCard'

const baseProps = {
  title: 'Awakening Your Inner Compass',
  slug: 'awakening-your-inner-compass',
  excerpt: 'A guide to trusting your intuition on the spiritual path.',
  coverImage: 'https://example.com/cover.jpg',
  publishedAt: new Date('2024-03-15T00:00:00.000Z'),
  tags: ['intuition', 'spirituality'],
}

describe('BlogCard', () => {
  it('renders the post title', () => {
    render(<BlogCard {...baseProps} />)
    expect(screen.getByText(baseProps.title)).toBeInTheDocument()
  })

  it('renders the excerpt', () => {
    render(<BlogCard {...baseProps} />)
    expect(screen.getByText(baseProps.excerpt)).toBeInTheDocument()
  })

  it('renders the cover image with correct alt text', () => {
    render(<BlogCard {...baseProps} />)
    const img = screen.getByAltText(baseProps.title)
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', baseProps.coverImage)
  })

  it('renders all tags', () => {
    render(<BlogCard {...baseProps} />)
    for (const tag of baseProps.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument()
    }
  })

  it('renders the formatted published date', () => {
    render(<BlogCard {...baseProps} />)
    // Formatted as "March 15, 2024"
    expect(screen.getByText('March 15, 2024')).toBeInTheDocument()
  })

  it('links title to the correct blog post URL', () => {
    render(<BlogCard {...baseProps} />)
    const links = screen.getAllByRole('link', { name: baseProps.title })
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]).toHaveAttribute('href', `/blog/${baseProps.slug}`)
  })

  it('renders with no tags gracefully', () => {
    render(<BlogCard {...baseProps} tags={[]} />)
    expect(screen.getByText(baseProps.title)).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Tags' })).not.toBeInTheDocument()
  })
})
