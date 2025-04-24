import { z } from 'zod';

export const configZodSchema = z.object({
  NODE_ENV: z.enum(['local', 'dev', 'prod', 'stg']),
  APP_PORT: z.string().transform((val) => parseInt(val, 10)),
  BACKOFFICE_PORT: z.string().transform((val) => parseInt(val, 10)),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  DEFAULT_TIMEOUT_MS: z.string().transform((val) => parseInt(val, 10)),
  MONGO_URI: z.string(),
  MONGO_DB_NAME: z.string(),
  ENCRYPTION_KEY: z.string().length(32),
  SENDGRID_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_FROM_NUMBER: z.string(),
  WHATSAPP_PHONE_NUMBER_ID: z.string(),
  WHATSAPP_ACCESS_TOKEN: z.string(),
  WHATSAPP_API_URL: z.string().default('https://graph.facebook.com/v21.0'),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string(),
  NOTIFICATIONS_PORT: z.string().transform((val) => parseInt(val, 10)),
});
