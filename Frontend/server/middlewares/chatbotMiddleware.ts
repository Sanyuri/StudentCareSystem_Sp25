import { createProxyMiddleware } from 'http-proxy-middleware'
import { ENV } from '../config/envConfig.js'

export const chatbotMiddleware = createProxyMiddleware({
  target: ENV.AI_SERVICE_URL,
  logger: console,
  changeOrigin: true,
  pathRewrite: { '^/_chat': '' },
})
