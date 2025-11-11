import { BaseService } from '#src/services/BaseService.js'
import { EMAIL_DEFER_URL, EMAIL_FAILED_URL } from '#utils/constants/api.js'
import { AddNewEmailDeferRequest, AddNewEmailFailRequest } from '#types/RequestModel/ApiRequest.js'

export const EmailService = {
  addEmailDefer(body: AddNewEmailDeferRequest): Promise<void> {
    return BaseService.post<void>(EMAIL_DEFER_URL, body)
  },
  addEmailFail(body: AddNewEmailFailRequest): Promise<void> {
    return BaseService.post<void>(EMAIL_FAILED_URL, body)
  },
}
