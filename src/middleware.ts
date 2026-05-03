import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { shouldRedirectToLogin } from './lib/middleware-utils'

const SESSION_COOKIE_NAME = '__session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check for session cookie existence
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME)
  
  if (shouldRedirectToLogin(pathname, hasSessionCookie)) {
    const loginUrl = new URL('/admin/login', request.url)
    // Optional: add a 'from' query param to redirect back after login
    // loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
