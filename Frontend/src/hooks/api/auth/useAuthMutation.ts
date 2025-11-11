import { UseMutationResult } from '@tanstack/react-query'
import { useGenericMutation } from '../useGenericMutation'
import { AccountService } from '#src/services/AccountService.js'
import { LoginResponse } from '#src/types/ResponseModel/ApiResponse.js'

export const useSignAsUserMutation = (): UseMutationResult<
  LoginResponse,
  unknown,
  string,
  unknown
> =>
  useGenericMutation(
    async (userId: string): Promise<LoginResponse> => {
      return await AccountService.signAs(userId)
    },
    'SETTINGS.SIGN_AS_SUCCESS', // Success toast translation key
    'SETTINGS.SIGN_AS_FAIl', // Error toast translation key
    [], // Query keys to invalidate
  )
