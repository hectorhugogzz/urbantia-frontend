// pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/libs/prisma';
import * as bcrypt from 'bcryptjs';
import { logError } from '@/utils/errorHandler';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'admin@yourdomain.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null;
          }

          // Find the user in the database using Prisma
          const user = await prisma.app_users.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            logError(new Error(`User not found with email: ${credentials.email}`), 'authorize');
            return null;
          }

          // Compare the provided password with the stored hash
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!isPasswordValid) {
            logError(new Error(`Invalid password for user: ${credentials.email}`), 'authorize');
            return null;
          }

          // If everything is correct, return the user object (without the password hash)
          return {
            id: String(user.id),
            name: user.full_name,
            email: user.email,
            role: user.user_role,
          };
        } catch (error) {
          logError(error, 'authorize');
          return null;
        }
      },
    }),
  ],
  // Use JWT for session strategy
  session: {
    strategy: 'jwt',
  },
  // Define custom pages
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on error
  },
  // Add user role to the session token
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // A secret key for signing tokens
});