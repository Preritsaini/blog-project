import { type NextRequest, NextResponse } from 'next/server'
import { auth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin'
import { shouldRedirectToLogin } from '@/lib/middleware-utils'

export { shouldRedirectToLogin }

const SESSION_COOKIE_NAME = '__session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard /admin/* routes (excluding /admin/login)
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await auth(adminApp).verifySessionCookie(sessionCookie, true)
    return NextResponse.next()
  } catch {
    // Cookie is invalid or expired — delete it and redirect
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete(SESSION_COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
