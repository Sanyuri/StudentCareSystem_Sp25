import { ClientRequest } from 'http'
import { ENV } from '../config/envConfig.js'
import { createProxyMiddleware } from 'http-proxy-middleware'

export const googleScriptMiddleware = createProxyMiddleware({
  target: ENV.GOOGLE_APP_SCRIPT_URL,
  logger: console,
  changeOrigin: true,
  pathRewrite: { '^/_google-script/': '' },
  on: {
    proxyReq: (proxyReq: ClientRequest) => {
      if (proxyReq.path.endsWith('/')) {
        proxyReq.path = proxyReq.path.slice(0, -1)
      }
    },
  },
})
