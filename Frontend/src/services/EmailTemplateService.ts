import {
  UpdateEmailTemplateRequest,
  AddEmailTemplateRequest,
  EmailTemplateRequest,
  EmailTemplate,
} from '#src/types/RequestModel/EmailTemplateRequest.js'
import {
  EmailTemplateListResponse,
  EmailTemplateResponse,
} from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import { EMAIL_TEMPLATE_LIST_URL } from '#utils/constants/api.js'

export const EmailTemplateService = {
  list(params?: EmailTemplateRequest): Promise<EmailTemplateListResponse> {
    return BaseService.get<EmailTemplateListResponse>(
      EMAIL_TEMPLATE_LIST_URL,
      convertParamsGeneric(params),
    )
  },
  detail(param: EmailTemplate): Promise<EmailTemplateResponse> {
    return BaseService.get<EmailTemplateResponse>(`${EMAIL_TEMPLATE_LIST_URL}/${param.id}`)
  },
  addEmailSample(param: AddEmailTemplateRequest): Promise<EmailTemplateResponse> {
    return BaseService.post<EmailTemplateResponse>(EMAIL_TEMPLATE_LIST_URL, param)
  },
  updateEmailTemplate(param: EmailTemplate, body: UpdateEmailTemplateRequest): Promise<void> {
    return BaseService.put<void>(`${EMAIL_TEMPLATE_LIST_URL}/${param.id}`, body)
  },
  deleteEmailTemplate(param: EmailTemplate): Promise<void> {
    return BaseService.delete<void>(`${EMAIL_TEMPLATE_LIST_URL}/${param.id}`)
  },
}
