# syntax=docker/dockerfile:1

# =========================
# Build stage
# =========================
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src ./src

RUN npm run build


# =========================
# Production stage
# =========================
FROM node:24-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S nodejs && \
    adduser -S appuser -G nodejs

COPY package*.json ./

RUN npm ci --omit=dev && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist

USER appuser

EXPOSE 5000

HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=10s \
  --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health || exit 1

CMD ["node", "dist/server.js"]