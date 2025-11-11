import { Express } from 'express'
import AuthRoutes from './authRoutes.js'
import cookieParser from 'cookie-parser'
import TokenRouter from './tokenRouter.js'
import imageRoutes from './imageRoutes.js'

const routes = (app: Express) => {
  app.use('/_proxy/api/auth', AuthRoutes)
  app.use('/fe/api', imageRoutes)
  app.use('/_auth', cookieParser(), TokenRouter)
}

export default routes
