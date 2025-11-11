import { z } from 'zod'

export const authSchemas = {
  SIGN_IN: z.object({
    campusCode: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    code: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    reCaptcha: z.string().min(1, { message: 'Recaptcha can not be' }),
  }),
}
