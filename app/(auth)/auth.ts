import { compare } from 'bcrypt-ts';
import NextAuth, { type Session, type User as NextAuthUser } from 'next-auth';

// Extend the NextAuth User type to include role
type User = NextAuthUser & { role?: string };
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/lib/db/queries';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User & { role?: string };
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        try {
          console.log('Attempting to authenticate user:', email);
          const users = await getUser(email);
          if (users.length === 0) {
            console.log('User not found:', email);
            return null;
          }
          
          const user = users[0];
          // biome-ignore lint: Forbidden non-null assertion.
          const passwordsMatch = await compare(password, user.password!);
          if (!passwordsMatch) {
            console.log('Password mismatch for user:', email);
            return null;
          }
          
          console.log('User authenticated successfully:', email);
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          } as any;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Use type assertion to access the role property
        const userWithRole = user as any;
        if (userWithRole.role) {
          token.role = userWithRole.role;
        }
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
});
