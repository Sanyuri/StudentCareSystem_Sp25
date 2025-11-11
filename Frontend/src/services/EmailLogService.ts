import { BaseService } from './BaseService'
import { EMAIL_LOG_URL } from '#utils/constants/api.js'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import { EmailLogRequest } from '#src/types/RequestModel/EmailLogRequest.js'
import {
  EmailLogListResponse,
  EmailLogResponse,
} from '#src/types/ResponseModel/EmailLogResponse.js'

export const EmailLogService = {
  getAll: async (filter: EmailLogRequest): Promise<EmailLogListResponse> => {
    return BaseService.get<EmailLogListResponse>(EMAIL_LOG_URL, convertParamsGeneric(filter))
  },
  getById: async (filter: string): Promise<EmailLogResponse> => {
    return BaseService.get<EmailLogResponse>(`${EMAIL_LOG_URL}/${filter}`)
  },
}
