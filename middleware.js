import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request) {
  const token = request.cookies.get('authToken')?.value;
  
  // Allow setup route for initial database setup
  if (request.nextUrl.pathname.startsWith('/api/setup')) {
    return NextResponse.next();
  }
  
  if (request.nextUrl.pathname.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }
  
  if (request.nextUrl.pathname.startsWith('/api/') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (request.nextUrl.pathname !== '/login' && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};