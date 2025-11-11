import { LogoutRequest } from '#src/types/RequestModel/AuthenRequest.js'
import { LoginResponse, RefreshTokenResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import {
  ADD_REFRESH_TOKEN_URL,
  GET_REFRESH_TOKEN_URL,
  LOGOUT_URL,
  REFRESH_TOKEN_URL,
  REMOVE_REFRESH_TOKEN_URL,
  SIGN_AS_URL,
  SIGN_IN_GOOGLE_URL,
} from '#utils/constants/api.js'

export const AccountService = {
  login: (values: object): Promise<LoginResponse> => {
    return BaseService.post<LoginResponse>(SIGN_IN_GOOGLE_URL, values)
  },

  logout: (values: LogoutRequest): Promise<string> => {
    return BaseService.post<string>(LOGOUT_URL, values)
  },

  refreshToken: (values: object): Promise<RefreshTokenResponse> => {
    return BaseService.post<RefreshTokenResponse>(REFRESH_TOKEN_URL, values)
  },

  getRefreshToken: (): Promise<string> => {
    return BaseService.get<string>(GET_REFRESH_TOKEN_URL)
  },

  addRefreshToken: (values: object): Promise<void> => {
    return BaseService.post<void>(ADD_REFRESH_TOKEN_URL, values)
  },

  removeRefreshToken: (): Promise<void> => {
    return BaseService.delete<void>(REMOVE_REFRESH_TOKEN_URL)
  },
  signAs: (userId: string): Promise<LoginResponse> => {
    return BaseService.post<LoginResponse>(`${SIGN_AS_URL}?userId=${userId}`)
  },
}
