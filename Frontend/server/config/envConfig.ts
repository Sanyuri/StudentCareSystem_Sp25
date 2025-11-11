import dotenv from 'dotenv'

dotenv.config()
export const ENV = {
  BACKEND: process.env.META__BACKEND ?? 'http://localhost:5000',
  CHECKSUM_KEY: process.env.META__CHECKSUM_KEY ?? '1234567890',
  SERVER_PORT: process.env.META__PORT ?? 4000,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  GOOGLE_CLIENT_KEY: process.env.PUBLIC_ENV__META__GOOGLE_CLIENT_KEY ?? '123',
  AI_SERVICE_URL: process.env.META__CHAT_BOT_ENDPOINT ?? 'http://localhost:8000',
  AI_KEY_SERVICE: process.env.META__CHAT_BOT_KEY ?? '123',
  GOOGLE_RECAPTCHA_KEY: process.env.META__RECAPTCHA_KEY ?? '123',
  GOOGLE_APP_SCRIPT_URL: process.env.META__GOOGLE_APP_SCRIPT_URL ?? 'https://script.google.com',
}
