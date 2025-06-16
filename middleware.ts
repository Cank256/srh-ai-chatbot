import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/app/(auth)/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  // Check if the request is for admin routes
  if (nextUrl.pathname.startsWith('/admin')) {
    // If no session, redirect to login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // If user is not admin, redirect to main chat page
  const userWithRole = user as any;
  if (userWithRole?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register', '/admin/:path*'],
};
