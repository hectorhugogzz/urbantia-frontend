// src/libs/prisma.ts

import { PrismaClient } from '@prisma/client';

// This prevents Next.js from creating too many instances of Prisma Client in development
// due to hot-reloading. In production, it will only create one instance.

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}