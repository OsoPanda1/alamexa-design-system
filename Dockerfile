# Use Dockerfile frontend for advanced features
# syntax=docker/dockerfile:1.4

########################
# Build stage
########################
FROM node:20-alpine AS builder
ARG NODE_ENV=production
ARG PNPM_VERSION=8
WORKDIR /app
ENV NODE_ENV=${NODE_ENV}

# Enable corepack + pnpm
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# Copy package manifests first to leverage Docker cache
# If you use pnpm-lock.yaml, it will be used; otherwise adjust accordingly.
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (dev deps needed for build)
# --frozen-lockfile to ensure reproducible installs when lockfile present
RUN pnpm install --frozen-lockfile --offline=false

# Copy source and build
COPY . .
# Ensure .env is not copied into the image in case someone left it (recommended to keep local only)
# If you need build-time env, pass --build-arg VITE_API_URL=...
RUN pnpm build

########################
# Runtime stage: nginx (small, secure)
########################
FROM nginx:stable-alpine AS runner

LABEL org.opencontainers.image.title="alamexa"
LABEL org.opencontainers.image.description="ALAMEXA - SPA served with nginx"
LABEL org.opencontainers.image.licenses="MIT"

# Optional: provide a directory for custom nginx config (see docker/nginx.conf)
# Copy a hardened nginx config (provided alongside this Dockerfile)
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure proper permissions (nginx runs as 'nginx' user in this image)
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && chmod -R 755 /usr/share/nginx/html

# Install curl (small) for HEALTHCHECK - keeps runtime image flexible for health queries
RUN apk add --no-cache curl

# Expose standard HTTP port
EXPOSE 80

# Use non-root user provided by the image
USER nginx

# Healthcheck: checks root path responds 200
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Keep nginx running in foreground
CMD ["nginx", "-g", "daemon off;"]
