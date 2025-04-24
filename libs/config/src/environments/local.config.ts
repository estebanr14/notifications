import { Config, BaseConfig } from '../config.interface';

export const localConfig: (baseConfig: BaseConfig) => Config = (
  baseConfig: BaseConfig,
) => ({
  ...baseConfig,
  environment: 'local',
  appAdminUrl: 'http://localhost:3001',
  swagger: {
    backoffice: {
      title: 'Backoffice - Local',
      description: 'Backoffice API - Local - v.1.0.0',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
    backend: {
      title: 'Backend - Local',
      description: 'Backend API - Local - v.1.0.0',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
    notifications: {
      title: 'Notifications - Local',
      description: 'Notifications API - Local - v.1.0.0',
      path: 'docs',
      username: baseConfig.swaggerCredentials.username,
      password: baseConfig.swaggerCredentials.password,
    },
  },
  auth: {
    jwtExpirationTime: '7d',
    jwtRefreshTime: '15d',
  },
  rabbit: {
    ...baseConfig.rabbit,
    connectionString: `amqp://${baseConfig.rabbit.user}:${baseConfig.rabbit.pass}@${baseConfig.rabbit.host}:${baseConfig.rabbit.port}`,
    backend: {
      queue: 'backend-queue',
      exchange: 'backend-exchange',
      routingKey: 'backend.#',
      dlxQueue: 'backend-dlx-queue',
      dlxRoutingKey: 'retry',
      dlx: 'backend-dlx',
      failedQueue: 'backend-failed-queue',
      failedRoutingKey: 'failed',
    },
    backoffice: {
      queue: 'backoffice-queue',
      exchange: 'backoffice-exchange',
      routingKey: 'backoffice.#',
      dlxQueue: 'backoffice-dlx-queue',
      dlxRoutingKey: 'retry',
      dlx: 'backoffice-dlx',
      failedQueue: 'backoffice-failed-queue',
      failedRoutingKey: 'failed',
    },
    notifications: {
      queue: 'notifications-queue',
      exchange: 'notifications-exchange',
      routingKey: 'notifications.#',
      dlxQueue: 'notifications-dlx-queue',
      dlxRoutingKey: 'retry',
      dlx: 'notifications-dlx',
      failedQueue: 'notifications-failed-queue',
      failedRoutingKey: 'failed',
    },
  },
});
