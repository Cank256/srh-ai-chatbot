import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/app/(auth)/auth.config';

const { auth } = NextAuth({
  ...authConfig,
  trustHost: true,
});

// Since we can't use database queries in the Edge runtime,
// we'll let the admin layout handle the role check
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const path = nextUrl.pathname;

  // Skip static assets
  if (path.includes('/_next/') || path.includes('/assets/') || path.includes('/favicon.ico') || path.endsWith('.css') || path.endsWith('.js') || path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.gif') || path.endsWith('.svg')) {
    return NextResponse.next();
  }

  // Redirect root path to /chat
  if (path === '/') {
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  // Check if the current path is an admin route
  const adminRoutePattern = /^\/admin(?:\/|$)/;
  const isAdminRoute = adminRoutePattern.test(path);

  if (isAdminRoute) {
    console.log(`Middleware processing admin route: ${path}`);
    console.log('User data in middleware:', JSON.stringify(req.auth));
    
    // If no session, redirect to login
    if (!isLoggedIn) {
      console.log('User not logged in, redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // We'll let the admin layout handle the role check
    // This is because we can't use database queries in the Edge runtime
    console.log('User is logged in, proceeding to admin layout for role check');
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*$).*)',
  ],
};
