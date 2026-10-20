# Build-Kontext ist die Repo-Wurzel (siehe docker-compose.yml)
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY platform/package.json platform/package-lock.json ./
# better-sqlite3 liefert keine fertigen Binaries mit und wird beim Installieren kompiliert
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY platform/ ./
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    CONTENT_DIR=/app/content \
    DATA_DIR=/data
RUN mkdir -p /data && chown node:node /data
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/scripts ./scripts
# Lerninhalte aus dem Repo (ohne platform/, .git usw., siehe .dockerignore)
COPY --chown=node:node . ./content
RUN rm -rf ./content/platform
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
