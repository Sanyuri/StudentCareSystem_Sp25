import express, { NextFunction, Request, Response, Router } from 'express'
import { validationSchemas } from '../schemas/index.js'
import { validateMiddleware } from '../middlewares/validateMiddleware.js'

const router: Router = express.Router()

router.post(
  '/signin-google',
  validateMiddleware(validationSchemas.auth.SIGN_IN),
  (req: Request, res: Response, next: NextFunction): void => {
    next()
  },
)

export default router
