import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export const validateMiddleware = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate data using zod
      const result = await schema.safeParseAsync(req.body.data)
      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        res.status(400).json({ message: 'Validation errors', errors })
        return
      }

      next()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err) {
        res.status(400).json({ message: 'Invalid JSON format' })
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: err.message })
      }
    }
  }
}
