# ==============================================================================
# Dockerfile for Next.js Frontend
#
# This Dockerfile uses a multi-stage build to create a small, optimized, and
# secure production image for a Next.js application.
# ==============================================================================

# --- Stage 1: Builder ---
# This stage installs dependencies and builds the Next.js application.
FROM node:20-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production
RUN npm run build

# --- Stage 2: Runner ---
# This stage creates the final, lightweight production image.
FROM node:20-slim AS runner

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application from the builder stage
# Note: We copy the public, static, and standalone directories, plus package.json
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the user to the non-root user
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# The command to start the application
CMD ["node", "server.js"]