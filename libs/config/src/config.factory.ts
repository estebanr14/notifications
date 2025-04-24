import { str } from 'envalid';
import { cleanEnv } from 'envalid';
import secretManagerConfig from './aws/secret-manager.config';
import { BaseConfig, Config } from './config.interface';
import { developmentConfig } from './environments/development.config';
import { localConfig } from './environments/local.config';
import { productionConfig } from './environments/production.config';
import { stagingConfig } from './environments/staging.config';

let cachedConfig: Config;

export default async (): Promise<Config> => {
  if (cachedConfig) return cachedConfig;

  const awsSecrets = await secretManagerConfig();
  const envVars = process.env;

  const env = cleanEnv(
    { ...awsSecrets, ...envVars },
    {
      NODE_ENV: str({ desc: 'Environment' }),
      APP_PORT: str({ desc: 'App Port' }),
      APP_NAME: str({
        desc: 'App Name',
        choices: ['backend', 'backoffice', 'notifications'],
      }),
      JWT_SECRET: str({ desc: 'JWT Secret' }),
      JWT_REFRESH_SECRET: str({ desc: 'JWT Refresh Secret' }),
      SENDGRID_API_KEY: str({ desc: 'Sendgrid API Key' }),
      EMAIL_FROM: str({ desc: 'Email From', default: 'noreply@panizza.dev' }),
      BACKOFFICE_PORT: str({ desc: 'Backoffice Port' }),
      MONGO_URI: str({ desc: 'Mongo URI' }),
      MONGO_DB_NAME: str({ desc: 'Mongo DB Name' }),
      DEFAULT_TIMEOUT_MS: str({
        desc: 'Default Timeout in ms',
        default: '8000',
      }),
      ENCRYPTION_KEY: str({ desc: 'Encryption Key' }),
      SWAGGER_USERNAME: str({ desc: 'Swagger Username' }),
      SWAGGER_PASSWORD: str({ desc: 'Swagger Password' }),
      RABBIT_HOST: str({ desc: 'Rabbit Host' }),
      RABBIT_PORT: str({ desc: 'Rabbit Port' }),
      RABBITMQ_DEFAULT_USER: str({ desc: 'Rabbit User' }),
      RABBITMQ_DEFAULT_PASS: str({ desc: 'Rabbit Pass' }),
      MELONN_BASE_URL: str({ desc: 'Melonn Base URL' }),
      MELONN_API_KEY: str({ desc: 'Melonn API Key' }),
      TWILIO_ACCOUNT_SID: str({ desc: 'Twilio Account SID' }),
      TWILIO_AUTH_TOKEN: str({ desc: 'Twilio Auth Token' }),
      TWILIO_FROM_NUMBER: str({ desc: 'Twilio From Number' }),
      WHATSAPP_PHONE_NUMBER_ID: str({ desc: 'WhatsApp Phone Number ID' }),
      WHATSAPP_ACCESS_TOKEN: str({ desc: 'WhatsApp Access Token' }),
      WHATSAPP_API_URL: str({
        desc: 'WhatsApp API URL',
        default: 'https://graph.facebook.com/v21.0',
      }),
      WHATSAPP_PHONE_NUMBER: str({ desc: 'WhatsApp Phone Number' }),
      NOTIFICATIONS_PORT: str({ desc: 'Notifications Port' }),
      WHATSAPP_WEBHOOK_VERIFY_TOKEN: str({
        desc: 'WhatsApp Webhook Verify Token',
      }),
      NOTIFICATIONS_MOCK: str({ desc: 'Notifications Mock', default: 'false' }),
    },
  );

  Object.assign(process.env, env); //Just to make sure the env vars are available for the string value object

  const baseConfig: BaseConfig = {
    environment: env.NODE_ENV,
    jwtSecret: env.JWT_SECRET,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    appPort: parseInt(env.APP_PORT, 10),
    appName: env.APP_NAME,
    backofficePort: parseInt(env.BACKOFFICE_PORT, 10),
    sendgridApiKey: env.SENDGRID_API_KEY,
    emailFrom: env.EMAIL_FROM,
    mongo: {
      uri: env.MONGO_URI,
      dbName: env.MONGO_DB_NAME,
    },
    defaultTimeoutMs: parseInt(env.DEFAULT_TIMEOUT_MS, 10),
    encryptionKey: env.ENCRYPTION_KEY,
    swaggerCredentials: {
      username: env.SWAGGER_USERNAME,
      password: env.SWAGGER_PASSWORD,
    },
    rabbit: {
      host: env.RABBIT_HOST,
      port: env.RABBIT_PORT,
      user: env.RABBITMQ_DEFAULT_USER,
      pass: env.RABBITMQ_DEFAULT_PASS,
    },
    logisticProvider: {
      melonn: {
        baseUrl: env.MELONN_BASE_URL,
        apiKey: env.MELONN_API_KEY,
      },
    },
    twilio: {
      accountSid: env.TWILIO_ACCOUNT_SID,
      authToken: env.TWILIO_AUTH_TOKEN,
      fromNumber: env.TWILIO_FROM_NUMBER,
    },
    whatsapp: {
      phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
      accessToken: env.WHATSAPP_ACCESS_TOKEN,
      apiUrl: env.WHATSAPP_API_URL,
      phoneNumber: env.WHATSAPP_PHONE_NUMBER,
      webhookVerifyToken: env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
    },
    notificationsPort: parseInt(env.NOTIFICATIONS_PORT, 10),
    notificationsMock: env.NOTIFICATIONS_MOCK === 'true',
  };

  switch (baseConfig.environment) {
    case 'prod':
      cachedConfig = productionConfig(baseConfig);
      break;
    case 'dev':
      cachedConfig = developmentConfig(baseConfig);
      break;
    case 'stg':
      cachedConfig = stagingConfig(baseConfig);
      break;
    case 'local':
      cachedConfig = localConfig(baseConfig);
      break;
    default:
      throw new Error(`Invalid NODE_ENV value: ${process.env.NODE_ENV}`);
  }

  return cachedConfig;
};
