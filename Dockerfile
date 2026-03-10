FROM node:24.11.0-alpine AS base
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3050
CMD ["pnpm", "run", "start:prod"]
