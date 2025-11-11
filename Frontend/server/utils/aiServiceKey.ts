import { NextFunction, Request, Response } from 'express'
import { ENV } from '../config/envConfig.js'

export function addAIServiceKey(req: Request, res: Response, next: NextFunction) {
  req.headers['X-API-KEY'] = ENV.AI_KEY_SERVICE
  next()
}
