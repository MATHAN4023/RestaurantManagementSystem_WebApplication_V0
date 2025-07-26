import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value
  const isAuthPage = request.nextUrl.pathname === '/'
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  // If trying to access dashboard without token, redirect to login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/', '/dashboard/:path*']
} 