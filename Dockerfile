#  Dependencies installieren
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --ignore-scripts; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DOCKER_TAG=unset
ENV NEXT_PUBLIC_APP_VERSION=$DOCKER_TAG

RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED 1

RUN NEXT_PUBLIC_MAPBOX_TOKEN=APP_NEXT_PUBLIC_MAPBOX_TOKEN \
    RESEND_API_KEY=APP_RESEND_API_KEY \
    yarn build

# Production runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

RUN chmod +x ./entrypoint.sh

# Output file tracing → nur Build-Artefakte mitnehmen
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/server ./.next/server

USER nextjs

EXPOSE 3000
ENV PORT 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]
