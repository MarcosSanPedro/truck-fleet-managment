# Stage 1: Build the frontend
FROM node:20-alpine AS builder
WORKDIR /app
# Install Bun
RUN apk add --no-cache curl && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/
# Copy frontend source files
COPY . .
# Install dependencies and build
RUN bun install && bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]