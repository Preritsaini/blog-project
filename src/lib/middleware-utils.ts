/**
 * Pure function: determines whether the middleware should redirect to /admin/login.
 * Extracted for unit/property testing without Next.js internals.
 *
 * Returns true when the request should be redirected to /admin/login.
 */
export function shouldRedirectToLogin(
  pathname: string,
  hasValidSession: boolean
): boolean {
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  if (!isAdminRoute || isLoginPage) return false
  return !hasValidSession
}
