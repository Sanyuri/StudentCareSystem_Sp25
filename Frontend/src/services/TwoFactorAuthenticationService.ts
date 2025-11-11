import { TwoFactorAuthenticationRequest } from '#src/types/RequestModel/2FaRequest.js'
import { TwoFactorAuthenticationResponse } from '#src/types/ResponseModel/2FaResponse.js'
import { TWO_FACTOR_AUTHENTICATION_URL } from '#utils/constants/api.js'
import { BaseService } from './BaseService'

export const TwoFactorAuthenticationService = {
  enable2Fa: (): Promise<TwoFactorAuthenticationResponse> => {
    return BaseService.post<TwoFactorAuthenticationResponse>(
      `${TWO_FACTOR_AUTHENTICATION_URL}/enable`,
    )
  },
  disable2Fa: (): Promise<void> => {
    return BaseService.post<void>(`${TWO_FACTOR_AUTHENTICATION_URL}/disable`)
  },
  verify2Fa: (data: TwoFactorAuthenticationRequest): Promise<string> => {
    return BaseService.post<string>(`${TWO_FACTOR_AUTHENTICATION_URL}/verify`, data)
  },
}
