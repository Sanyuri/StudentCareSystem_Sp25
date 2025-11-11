import { TwoFactorAuthenticationService } from '#src/services/TwoFactorAuthenticationService.js'
import { TwoFactorAuthenticationRequest } from '#src/types/RequestModel/2FaRequest.js'
import { TwoFactorAuthenticationResponse } from '#src/types/ResponseModel/2FaResponse.js'
import { useGenericMutation } from '../useGenericMutation'

export const useEnable2FaMutation = () => {
  return useGenericMutation<unknown, TwoFactorAuthenticationResponse>(
    async (): Promise<TwoFactorAuthenticationResponse> => {
      return await TwoFactorAuthenticationService.enable2Fa()
    },
    'OTP.TOAST.SUCCESS.2FA.ENABLE',
    'OTP.TOAST.ERROR.2FA.ENABLE',
    ['currentUser'],
  )
}

export const useDisable2FaMutation = () => {
  return useGenericMutation<void, void>(
    async (): Promise<void> => {
      return await TwoFactorAuthenticationService.disable2Fa()
    },
    'OTP.TOAST.SUCCESS.2FA.DISABLE',
    'OTP.TOAST.ERROR.2FA.DISABLE',
    ['currentUser'],
  )
}

export const useVerify2FaMutation = () => {
  return useGenericMutation<TwoFactorAuthenticationRequest, string>(
    async (data: TwoFactorAuthenticationRequest): Promise<string> => {
      return await TwoFactorAuthenticationService.verify2Fa(data)
    },
    'OTP.TOAST.SUCCESS.2FA.VERIFY',
    'OTP.TOAST.ERROR.2FA.VERIFY',
    ['currentUser'],
  )
}
