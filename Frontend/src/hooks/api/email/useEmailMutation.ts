import { UseMutationResult } from '@tanstack/react-query'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { EmailService } from '#src/services/EmailService.js'
import { AddNewEmailDeferRequest, AddNewEmailFailRequest } from '#types/RequestModel/ApiRequest.js'

export const useAddEmailDeferMutation = (): UseMutationResult<
  unknown,
  unknown,
  AddNewEmailDeferRequest,
  unknown
> =>
  useGenericMutation(
    EmailService.addEmailDefer,
    'DEFERS.DEFER_MAIL.SUCCESS', // Success toast translation key
    'DEFERS.DEFER_MAIL.FAIL', // Error toast translation key
    ['email-template'], // Query keys to invalidate
  )

export const useAddEmailFailedMutation = (): UseMutationResult<
  unknown,
  unknown,
  AddNewEmailFailRequest,
  unknown
> =>
  useGenericMutation(
    EmailService.addEmailFail,
    'DEFERS.DEFER_MAIL.SUCCESS', // Success toast translation key
    'DEFERS.DEFER_MAIL.FAIL', // Error toast translation key
    ['email-template'], // Query keys to invalidate
  )
