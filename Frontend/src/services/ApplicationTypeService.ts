import {
  AddApplicationTypeRequest,
  ApplicationType,
  ApplicationTypeRequest,
  UpdateApplicationTypeRequest,
} from '#src/types/RequestModel/ApplicationTypeRequest.js'
import {
  ApplicationTypeListResponse,
  ApplicationTypeResp,
  ApplicationTypeResponse,
} from '#src/types/ResponseModel/ApplicationTypeResponse.js'
import { BaseService } from './BaseService'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import {
  APPLICATION_TYPE_LIST_ALL_URL,
  GET_APPLICATION_TYPE_LIST_URL,
} from '#utils/constants/api.js'

export const ApplicationTypeService = {
  getApplicationTypes(): Promise<ApplicationTypeResp[]> {
    const result = BaseService.get<ApplicationTypeResp[]>(GET_APPLICATION_TYPE_LIST_URL)
    return result
  },
  list(params?: ApplicationTypeRequest): Promise<ApplicationTypeListResponse> {
    return BaseService.get<ApplicationTypeListResponse>(
      APPLICATION_TYPE_LIST_ALL_URL,
      convertParamsGeneric(params),
    )
  },
  detail(param: ApplicationType): Promise<ApplicationTypeResponse> {
    return BaseService.get<ApplicationTypeResponse>(`${GET_APPLICATION_TYPE_LIST_URL}/${param.id}`)
  },
  addEmailSample(param: AddApplicationTypeRequest): Promise<ApplicationTypeResponse> {
    return BaseService.post<ApplicationTypeResponse>(GET_APPLICATION_TYPE_LIST_URL, param)
  },
  updateApplicationType(param: ApplicationType, body: UpdateApplicationTypeRequest): Promise<void> {
    return BaseService.put<void>(`${GET_APPLICATION_TYPE_LIST_URL}/${param.id}`, body)
  },
  deleteApplicationType(param: ApplicationType): Promise<void> {
    return BaseService.delete<void>(`${GET_APPLICATION_TYPE_LIST_URL}/${param.id}`)
  },
}
