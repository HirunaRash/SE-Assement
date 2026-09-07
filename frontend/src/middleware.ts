// frontend/src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');
  
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = ['/', '/login', '/register'];
  
  // Routes that require manager/admin role
  const managerRoutes = ['/dashboard', '/projects', '/users'];

  // If no token and trying to access protected route
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has token and trying to access public route
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};