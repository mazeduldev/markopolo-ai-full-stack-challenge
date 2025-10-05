# ---- Base ----
FROM node:22-slim AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# ---- Build ----
FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# ---- Release ----
FROM base AS release
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=build /usr/src/app/public ./public
COPY --from=build --chown=node:node /usr/src/app/.next/standalone ./
COPY --from=build --chown=node:node /usr/src/app/.next/static ./.next/static

USER node

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]