import {
  DeferScanRequest,
  StudentDeferRequest,
} from '#src/types/RequestModel/StudentDeferRequest.js'
import { StudentDefersListResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import { GET_ALL_STUDENT_DEFER_URL, SCAN_STUDENT_DEFER_URL } from '#utils/constants/api.js'

export const StudentDeferService = {
  list: (params?: StudentDeferRequest): Promise<StudentDefersListResponse> => {
    return BaseService.get<StudentDefersListResponse>(
      GET_ALL_STUDENT_DEFER_URL,
      convertParamsGeneric(params),
    )
  },
  getLastUpdatedData: (): Promise<string> => {
    return BaseService.get<string>(`${GET_ALL_STUDENT_DEFER_URL}/last-updated-date`)
  },
  scan(params?: DeferScanRequest): Promise<string> {
    return BaseService.post<string>(SCAN_STUDENT_DEFER_URL, params)
  },
}
