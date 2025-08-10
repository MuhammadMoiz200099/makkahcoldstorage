import { NextResponse } from 'next/server';
import { getAuthUser } from './lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const authUser = getAuthUser(request);
  
  if (!authUser) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check admin-only routes
  const adminRoutes = ['/users'];
  if (adminRoutes.includes(pathname) && authUser.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};