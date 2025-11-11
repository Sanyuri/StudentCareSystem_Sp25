import { BaseService } from '#src/services/BaseService.js'
import {
  AddSubEmailRequest,
  SubEmailDetailRequest,
  SubEmailRequest,
  UpdateSubEmailRequest,
} from '#types/RequestModel/SubEmailRequest.js'
import { SubEmailListResponse, SubEmailResponse } from '#types/ResponseModel/ApiResponse.js'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import { SUB_EMAIL_TEMPLATE_URL } from '#utils/constants/api.js'

export const SubEmailService = {
  list(params?: SubEmailRequest): Promise<SubEmailListResponse> {
    return BaseService.get<SubEmailListResponse>(
      SUB_EMAIL_TEMPLATE_URL,
      convertParamsGeneric(params),
    )
  },
  detail(param: SubEmailDetailRequest): Promise<SubEmailResponse> {
    return BaseService.get<SubEmailResponse>(`${SUB_EMAIL_TEMPLATE_URL}/${param.id}`)
  },
  addSubEmailSample(param: AddSubEmailRequest): Promise<SubEmailResponse> {
    return BaseService.post<SubEmailResponse>(SUB_EMAIL_TEMPLATE_URL, param)
  },
  updateSubEmailTemplate(param: SubEmailDetailRequest, body: UpdateSubEmailRequest): Promise<void> {
    return BaseService.put<void>(`${SUB_EMAIL_TEMPLATE_URL}/${param.id}`, body)
  },
  deleteSubEmailTemplate(param: SubEmailDetailRequest): Promise<void> {
    return BaseService.delete<void>(`${SUB_EMAIL_TEMPLATE_URL}/${param.id}`)
  },
}
