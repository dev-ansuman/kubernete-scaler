FROM node:20-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @kubernete-scaler/worker build

WORKDIR /app/apps/worker
EXPOSE 3001

CMD ["pnpm", "start"]