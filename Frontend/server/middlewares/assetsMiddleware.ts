import express, { Express } from 'express'
import { root } from '../root.js'
import { ENV } from '../config/envConfig.js'
import path from 'node:path'
import { createDevMiddleware } from 'vike/server'
const uploadDir: string = path.join(process.cwd(), 'uploads')

export async function assetsMiddleware(app: Express) {
  if (ENV.IS_PRODUCTION) {
    app.use(express.static(path.join(process.cwd(), '/build/client')))
    app.use('/uploads', express.static(uploadDir))
  } else {
    const { devMiddleware } = await createDevMiddleware({ root })
    app.use(devMiddleware)
  }
}
