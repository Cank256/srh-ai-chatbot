import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname === '/' || (nextUrl.pathname.startsWith('/') && !nextUrl.pathname.startsWith('/admin'));
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnResetPassword = nextUrl.pathname.startsWith('/reset-password');
      const isOnAdmin = nextUrl.pathname === '/admin' || nextUrl.pathname.startsWith('/admin/');

      if (isLoggedIn && (isOnLogin || isOnRegister || isOnResetPassword)) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      if (isOnRegister || isOnLogin || isOnResetPassword) {
        return true; // Always allow access to register and login pages
      }

      if (isOnAdmin) {
        // Admin routes are handled by middleware
        return true;
      }

      if (isOnChat) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
