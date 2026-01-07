FROM node:20-alpine AS builder

ARG VERSION=0.0.1
LABEL version=${VERSION}
LABEL name=abros-robot

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS production

ARG VERSION=0.0.1
LABEL version=${VERSION}
LABEL name=abros-robot

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

RUN chown -R nestjs:nodejs /app
USER nestjs

CMD ["node", "dist/main"]

