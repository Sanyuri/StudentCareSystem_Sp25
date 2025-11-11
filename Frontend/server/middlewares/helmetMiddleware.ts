import { Express, NextFunction, Request, Response } from 'express'

import helmet from 'helmet'
import { ENV } from '../config/envConfig.js'

export async function helmetMiddleware(app: Express, nonce: string) {
  if (ENV.IS_PRODUCTION) {
    // Disable the 'X-Powered-By' header to enhance security by preventing information disclosure about the framework used (Express).
    app.disable('x-powered-by')

    // use helmet to secure Http headers
    app.use(helmet())
    app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
    app.get('*', async (req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')

      process.env.CSP_NONCE = nonce

      // Lưu nonce vào res.locals để sử dụng trong CSP
      res.locals.nonce = nonce
      res.setHeader('x-nonce', nonce)
      // Gắn CSP với helmet
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'", 'https://accounts.google.com'],
          scriptSrc: [
            "'self'",
            `'nonce-${nonce}'`, // Sử dụng nonce động
            "'unsafe-inline'",
            'https://www.google.com',
            'https://accounts.google.com',
          ],
          styleSrc: [
            "'self'",
            `'unsafe-inline'`,
            'https://accounts.google.com/gsi/style',
            'https://accounts.google.com/gsi/client',
            'https://*.googleapis.com',
            'https://ssl.gstatic.com',
          ],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          connectSrc: [
            "'self'",
            'https://fu-scs.fpt.edu.vn',
            'https://fu-scs-gw.fpt.edu.vn',
            'https://sonbt.site',
          ],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      })(req, res, next) // Helmet middleware
    })
  }
}
