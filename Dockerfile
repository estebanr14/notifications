# Build stage
FROM node:20-alpine AS builder

# Build args
ARG NODE_ENV
ARG APP_NAME
ARG APP_PORT

# Set environment variables
ENV NODE_ENV=$NODE_ENV
ENV APP_NAME=$APP_NAME
ENV PORT=$APP_PORT

WORKDIR /app

# Copiar archivos necesarios
COPY package.json yarn.lock ./
COPY nest-cli.json tsconfig.json ./
COPY libs/ libs/
COPY apps/${APP_NAME}/ apps/${APP_NAME}/

# Install dependencies
RUN apk add --no-cache python3 make g++ && \
    yarn install --frozen-lockfile --network-timeout 100000

# Build application
RUN yarn build:${APP_NAME}

# Production stage
FROM node:20-alpine

ARG NODE_ENV
ARG APP_NAME
ARG APP_PORT
ENV NODE_ENV=$NODE_ENV
ENV APP_NAME=$APP_NAME
ENV PORT=$APP_PORT

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

RUN yarn install --frozen-lockfile --production

USER node
EXPOSE ${PORT}

CMD ["node", "dist/main.js"]