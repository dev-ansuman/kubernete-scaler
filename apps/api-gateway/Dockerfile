FROM node:20-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @kubernete-scaler/api-gateway build

WORKDIR /app/apps/api-gateway
EXPOSE 3000

CMD ["pnpm", "start"]