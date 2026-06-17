# =============================================================================
# Production Dockerfile for React + Vite Portfolio
# Multi-stage build: build stage -> nginx serve stage
# =============================================================================

# ---- Build Stage ----
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better cache layering
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ---- Serve Stage ----
FROM nginx:alpine AS runner

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]