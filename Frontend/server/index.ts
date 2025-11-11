import dotenv from 'dotenv'
import CryptoJS from 'crypto-js'
import routes from './routes/index.js'
import cookieParser from 'cookie-parser'
import express, { Express } from 'express'
import { ENV } from './config/envConfig.js'
import { addChecksum } from './utils/checksum.js'
import { vikeMiddleware } from './middlewares/vikeMiddleware.js'
import { proxyMiddleware } from './middlewares/proxyMiddleware.js'
import { assetsMiddleware } from './middlewares/assetsMiddleware.js'
import { chatbotMiddleware } from './middlewares/chatbotMiddleware.js'
import { googleScriptMiddleware } from './middlewares/googleScriptMiddleware.js'
import { addAIServiceKey } from './utils/aiServiceKey.js'

dotenv.config()

void startServer()

async function startServer(): Promise<void> {
  const app: Express = express()
  // random nonce
  const nonce: string = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64)
  app.use('/_chat', addAIServiceKey, chatbotMiddleware)
  app.use('/_google-script', googleScriptMiddleware)
  app.use(express.json())
  // Routes to validate data before proxy to server backend
  routes(app)

  app.use(cookieParser())
  app.use('/_proxy', addChecksum, proxyMiddleware)
  await assetsMiddleware(app)
  vikeMiddleware(app, nonce)
  app.listen(ENV.SERVER_PORT)

  // eslint-disable-next-line no-console
  console.log(`Server running at localhost:${ENV.SERVER_PORT}`)
}
