FROM node:20-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @kubernete-scaler/stats build

WORKDIR /app/apps/stats
EXPOSE 3002

CMD ["pnpm", "start"]