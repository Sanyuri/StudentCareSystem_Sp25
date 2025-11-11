import {
  ApplicationDeleteRequest,
  ApplicationRequest,
} from '#src/types/RequestModel/ApplicationRequest.js'
import { CreateApplicationRequest } from '#src/types/RequestModel/CreateApplicationRequest.js'
import {
  ApplicationListResponse,
  GetApplicationDetailResponse,
} from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import { STUDENT_APPLICATION_URL } from '#utils/constants/api.js'

export const ApplicationService = {
  list: (params?: ApplicationRequest): Promise<ApplicationListResponse> => {
    return BaseService.get<ApplicationListResponse>(
      STUDENT_APPLICATION_URL,
      convertParamsGeneric(params),
    )
  },
  deleteApplication(params: ApplicationDeleteRequest): Promise<void> {
    return BaseService.delete<void>(`${STUDENT_APPLICATION_URL}/${params.id}`)
  },
  addApplication(body: CreateApplicationRequest): Promise<void> {
    return BaseService.post<void>(STUDENT_APPLICATION_URL, body)
  },
  getDetail(request: ApplicationDeleteRequest): Promise<GetApplicationDetailResponse> {
    return BaseService.get<GetApplicationDetailResponse>(`${STUDENT_APPLICATION_URL}/${request.id}`)
  },
}
