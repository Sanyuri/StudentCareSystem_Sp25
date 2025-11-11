import { Express, NextFunction, Request, Response } from 'express'
import { jwtDecode } from 'jwt-decode'
import { UserJwtPayload } from '../type/jwtType.js'
import { renderPage } from 'vike/server'
import { ENV } from '../config/envConfig.js'

export const vikeMiddleware = (app: Express, nonce: string): void => {
  app.get('*', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies['accessToken']

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user: any = null
    let permission: string[] = []
    try {
      if (token != null) {
        const decodedToken: UserJwtPayload = jwtDecode<UserJwtPayload>(token)
        const role: string =
          decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        permission = decodedToken.Permissions.split(',')
        user = { role: role, permission: permission }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      headersOriginal: req.headers,
      user: user,
      nonce: nonce,
      googleId: ENV.GOOGLE_CLIENT_KEY,
      googleReCaptchaKey: ENV.GOOGLE_RECAPTCHA_KEY,
      isProduction: ENV.IS_PRODUCTION,
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) {
      return next()
    } else {
      const { statusCode, headers, earlyHints } = httpResponse

      if (res.writeEarlyHints)
        res.writeEarlyHints({ link: earlyHints.map((e): string => e.earlyHintLink) })
      headers.forEach(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ([name, value]: [string, string]): Response<any, Record<string, any>> =>
          res.setHeader(name, value),
      )
      res.status(statusCode)
      httpResponse.pipe(res)
    }
  })
}
