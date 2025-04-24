import { BaseConfig, Config } from '../config.interface';

export const developmentConfig: (baseConfig: BaseConfig) => Config = (
  baseConfig: BaseConfig,
) => ({
  ...baseConfig,
  environment: 'dev',
  appAdminUrl: 'http://localhost:3001',
  swagger: {
    backoffice: {
      title: 'Backoffice - Development',
      description: 'Backoffice API - Development',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
    backend: {
      title: 'Backend - Development',
      description: 'Backend API - Development',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
    notifications: {
      title: 'Notifications - Development',
      description: 'Notifications API - Development',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
  },
  auth: {
    jwtExpirationTime: '4h',
    jwtRefreshTime: '1d',
  },
  rabbit: {
    ...baseConfig.rabbit,
    connectionString: `amqps://${baseConfig.rabbit.user}:${baseConfig.rabbit.pass}@${baseConfig.rabbit.host}:${baseConfig.rabbit.port}`,
    backend: {
      dlx: 'backend-dlx',
      dlxRoutingKey: 'retry',
      queue: 'backend-queue',
      dlxQueue: 'backend-dlx-queue',
      exchange: 'backend-exchange',
      routingKey: 'backend.#',
      failedQueue: 'backend-failed-queue',
      failedRoutingKey: 'failed',
    },
    backoffice: {
      dlx: 'backoffice-dlx',
      dlxRoutingKey: 'retry',
      queue: 'backoffice-queue',
      dlxQueue: 'backoffice-dlx-queue',
      exchange: 'backoffice-exchange',
      routingKey: 'backoffice.#',
      failedQueue: 'backoffice-failed-queue',
      failedRoutingKey: 'failed',
    },
    notifications: {
      dlx: 'notifications-dlx',
      dlxRoutingKey: 'retry',
      queue: 'notifications-queue',
      dlxQueue: 'notifications-dlx-queue',
      exchange: 'notifications-exchange',
      routingKey: 'notifications.#',
      failedQueue: 'notifications-failed-queue',
      failedRoutingKey: 'failed',
    },
  },
});
