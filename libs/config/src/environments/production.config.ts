import { BaseConfig, Config } from '../config.interface';

export const productionConfig: (baseConfig: BaseConfig) => Config = (
  baseConfig: BaseConfig,
) => ({
  ...baseConfig,
  environment: 'prod',
  appAdminUrl: 'http://localhost:3001',
  swagger: {
    backoffice: {
      title: 'Backoffice - Production',
      description: 'Backoffice API - Production',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
    backend: {
      title: 'Backend - Production',
      description: 'Backend API - Production',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
    notifications: {
      title: 'Notifications - Production',
      description: 'Notifications API - Production',
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
