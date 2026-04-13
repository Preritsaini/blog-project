// Feature: prateeksha-psychic-coach, Property 17
import * as fc from 'fast-check'
import { generateSlug } from './slug'

/**
 * Property 17: Slug generation produces valid URL-safe strings
 * Validates: Requirements 7.8
 */
describe('generateSlug', () => {
  it('Property 17: returns only lowercase letters, digits, and hyphens for any non-empty title', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (title) => {
          const slug = generateSlug(title)
          // If the title has no alphanumeric chars, slug may be empty — skip those
          if (slug.length === 0) return true
          // Only [a-z0-9-]
          expect(slug).toMatch(/^[a-z0-9-]+$/)
          // Does not start or end with a hyphen
          expect(slug).not.toMatch(/^-/)
          expect(slug).not.toMatch(/-$/)
          // No consecutive hyphens
          expect(slug).not.toMatch(/--/)
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('converts spaces to hyphens', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('strips non-alphanumeric characters', () => {
    expect(generateSlug('Hello, World!')).toBe('hello-world')
  })

  it('collapses multiple hyphens', () => {
    expect(generateSlug('a---b')).toBe('a-b')
  })

  it('strips leading and trailing hyphens', () => {
    expect(generateSlug('  ---hello---  ')).toBe('hello')
  })
})
