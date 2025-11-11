import { StringeeTokenResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { STRINGEE_SERVICE_TOKEN_URL } from '#utils/constants/api.js'
import { BaseService } from './BaseService'

export const StringeeService = {
  getToken: (): Promise<StringeeTokenResponse> => {
    return BaseService.get<StringeeTokenResponse>(STRINGEE_SERVICE_TOKEN_URL)
  },
}
