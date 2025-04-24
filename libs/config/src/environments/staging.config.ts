import { BaseConfig, Config } from '../config.interface';

export const stagingConfig: (baseConfig: BaseConfig) => Config = (
  baseConfig: BaseConfig,
) => ({
  ...baseConfig,
  environment: 'stg',
  appAdminUrl: 'http://localhost:3001',
  swagger: {
    backoffice: {
      title: 'Backoffice - Staging',
      description: 'Backoffice API - Staging',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
    backend: {
      title: 'Backend - Staging',
      description: 'Backend API - Staging',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
    notifications: {
      title: 'Notifications - Staging',
      description: 'Notifications API - Staging',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
  },
  auth: {
    jwtExpirationTime: '2h',
    jwtRefreshTime: '4h',
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
