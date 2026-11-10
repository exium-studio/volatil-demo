# ==========================================
# 1. Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm according to packageManager version in package.json
RUN npm install -g pnpm@11.8.0

# Copy dependency manifests and configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Install exact dependencies using lockfile
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY . .

# Build Vite SPA application for production
RUN pnpm build

# ==========================================
# 2. Production Stage (Nginx Alpine)
# ==========================================
FROM nginx:alpine AS runner

# Remove default nginx static assets and config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration listening on Port 3002
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built dist assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Dokploy deployment port 3002
EXPOSE 3002

CMD ["nginx", "-g", "daemon off;"]
