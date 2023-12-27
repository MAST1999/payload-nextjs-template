FROM node:20.10.0-slim as base

# Run on a specific port
ARG PORT

# Database connection string
ARG DATABASE_URI

# Used to encrypt JWT tokens
ARG PAYLOAD_SECRET

# Used to format links and URLs
ARG PAYLOAD_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_SERVER_URL

# Allow robots to index the site (optional)
ARG NEXT_PUBLIC_IS_LIVE

# Used to preview drafts
ARG PAYLOAD_PUBLIC_DRAFT_SECRET
ARG NEXT_PRIVATE_DRAFT_SECRET

# Used to revalidate static pages
ARG REVALIDATION_KEY
ARG NEXT_PRIVATE_REVALIDATION_KEY

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod-deps
WORKDIR /home/node/app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base as builder
WORKDIR /home/node/app

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload/payload.config.js

WORKDIR /home/node/app
COPY package*.json  ./
COPY pnpm-lock.yaml ./

COPY --from=prod-deps /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 3000

CMD ["node", "dist/server.js"]
