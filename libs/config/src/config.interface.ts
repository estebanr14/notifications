export interface BaseConfig {
  environment: string;
  appPort: number;
  appName: 'backend' | 'backoffice' | 'notifications';
  backofficePort: number;
  notificationsPort: number;
  jwtSecret: string;
  jwtRefreshSecret: string;
  sendgridApiKey: string;
  emailFrom: string;
  mongo: {
    uri: string;
    dbName: string;
  };
  defaultTimeoutMs: number;
  encryptionKey: string;
  swaggerCredentials: {
    username: string;
    password: string;
  };
  rabbit: {
    host: string;
    port: string;
    user: string;
    pass: string;
  };
  logisticProvider: {
    melonn: {
      baseUrl: string;
      apiKey: string;
    };
  };
  twilio: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  whatsapp: {
    phoneNumberId: string;
    accessToken: string;
    apiUrl: string;
    phoneNumber: string;
    webhookVerifyToken: string;
  };
  notificationsMock: boolean;
}
export interface Config extends BaseConfig {
  environment: 'local' | 'dev' | 'stg' | 'prod';
  appAdminUrl: string;
  swagger: {
    backoffice: {
      title: string;
      description: string;
      path: string;
      username: string;
      password: string;
    };
    backend: {
      title: string;
      description: string;
      path: string;
      username: string;
      password: string;
    };
    notifications: {
      title: string;
      description: string;
      path: string;
      username: string;
      password: string;
    };
  };
  auth: {
    jwtExpirationTime: string;
    jwtRefreshTime: string;
  };
  rabbit: {
    host: string;
    port: string;
    user: string;
    pass: string;
    connectionString: string;
    backend: {
      queue: string;
      exchange: string;
      routingKey: string;
      dlxQueue: string;
      dlxRoutingKey: string;
      dlx: string;
      failedQueue: string;
      failedRoutingKey: string;
    };
    backoffice: {
      queue: string;
      exchange: string;
      routingKey: string;
      dlxQueue: string;
      dlxRoutingKey: string;
      dlx: string;
      failedQueue: string;
      failedRoutingKey: string;
    };
    notifications: {
      queue: string;
      exchange: string;
      routingKey: string;
      dlxQueue: string;
      dlxRoutingKey: string;
      dlx: string;
      failedQueue: string;
      failedRoutingKey: string;
    };
  };
}
