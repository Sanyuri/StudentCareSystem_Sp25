import { createProxyMiddleware } from 'http-proxy-middleware'
import { ENV } from '../config/envConfig.js'
import { IncomingMessage } from 'http'
import { ClientRequest } from 'node:http'

// Config proxy to redirect request to back-end server
export const proxyMiddleware = createProxyMiddleware({
  target: ENV.BACKEND,
  logger: console,
  changeOrigin: true,
  pathRewrite: { '^/_proxy': '' },
  on: {
    // Convert the data in the body from json back to stream to redirect to the back end
    proxyReq: (proxyReq: ClientRequest, req: IncomingMessage) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const expressReq = req as any
      if (expressReq.body) {
        const bodyData = JSON.stringify(expressReq.body)
        proxyReq.setHeader('Content-Type', 'application/json')
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
        // stream the content
        proxyReq.write(bodyData)
      }
    },
  },
})
