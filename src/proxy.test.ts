// Feature: prateeksha-psychic-coach, Property 12
import * as fc from 'fast-check'
import { shouldRedirectToLogin } from './lib/proxy-utils'

/**
 * Property 12: Unauthenticated requests to /admin/* are redirected
 * Validates: Requirements 6.4, 6.6
 *
 * For any URL path that starts with `/admin/` (excluding `/admin/login`),
 * a request without a valid session cookie should result in a redirect to /admin/login.
 */

// Arbitrary: admin sub-paths that are NOT /admin/login
const adminSubPathArb = fc
  .string({ minLength: 1, maxLength: 30 })
  .map((s) =>
    // Ensure it's a valid path segment (no slashes, no empty)
    s.replace(/[^a-z0-9-_]/gi, 'x') || 'page'
  )
  .map((segment) => `/admin/${segment}`)
  .filter((p) => p !== '/admin/login')

// Arbitrary: non-admin paths
const nonAdminPathArb = fc
  .string({ minLength: 1, maxLength: 40 })
  .map((s) => `/${s.replace(/^\//, '')}`)
  .filter((p) => !p.startsWith('/admin'))

describe('shouldRedirectToLogin', () => {
  // ---------------------------------------------------------------------------
  // Property 12a: unauthenticated requests to /admin/* (not /admin/login) → redirect
  // ---------------------------------------------------------------------------
  it('Property 12: redirects unauthenticated requests to any /admin/* path (excluding /admin/login)', () => {
    fc.assert(
      fc.property(adminSubPathArb, (pathname) => {
        expect(shouldRedirectToLogin(pathname, false)).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  // ---------------------------------------------------------------------------
  // Property 12b: authenticated requests to /admin/* → no redirect
  // ---------------------------------------------------------------------------
  it('Property 12: does NOT redirect authenticated requests to /admin/* paths', () => {
    fc.assert(
      fc.property(adminSubPathArb, (pathname) => {
        expect(shouldRedirectToLogin(pathname, true)).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  // ---------------------------------------------------------------------------
  // Property 12c: /admin/login is never redirected regardless of session state
  // ---------------------------------------------------------------------------
  it('Property 12: never redirects /admin/login regardless of session state', () => {
    fc.assert(
      fc.property(fc.boolean(), (hasValidSession) => {
        expect(shouldRedirectToLogin('/admin/login', hasValidSession)).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  // ---------------------------------------------------------------------------
  // Property 12d: non-admin paths are never redirected
  // ---------------------------------------------------------------------------
  it('Property 12: never redirects non-admin paths', () => {
    fc.assert(
      fc.property(nonAdminPathArb, fc.boolean(), (pathname, hasValidSession) => {
        expect(shouldRedirectToLogin(pathname, hasValidSession)).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  // ---------------------------------------------------------------------------
  // Edge cases: exact /admin path (no trailing slash)
  // ---------------------------------------------------------------------------
  it('redirects unauthenticated requests to /admin (exact)', () => {
    expect(shouldRedirectToLogin('/admin', false)).toBe(true)
  })

  it('does not redirect authenticated requests to /admin (exact)', () => {
    expect(shouldRedirectToLogin('/admin', true)).toBe(false)
  })
})
