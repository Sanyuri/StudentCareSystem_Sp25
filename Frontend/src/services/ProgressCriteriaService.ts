import {
  CreateProgressCriteriaRequest,
  UpdateParamProgressCriteriaRequest,
} from '#src/types/RequestModel/ProgressCriteriaRequest.js'
import { GetProgressCriteriaResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { PROGRESS_CRITERIA_UPDATE_ALL_URL, PROGRESS_CRITERIA_URL } from '#utils/constants/api.js'
import { BaseService } from './BaseService'

export const ProgressCriteriaService = {
  getByStudentCare: (studentCareId: string): Promise<GetProgressCriteriaResponse> => {
    return BaseService.get<GetProgressCriteriaResponse>(
      `${PROGRESS_CRITERIA_URL}/by-student-need-care/${studentCareId}`,
    )
  },

  add(body: CreateProgressCriteriaRequest): Promise<void> {
    return BaseService.post<void>(PROGRESS_CRITERIA_URL, body)
  },

  updateAll({ studentNeedCareId, body }: UpdateParamProgressCriteriaRequest): Promise<void> {
    return BaseService.put<void>(`${PROGRESS_CRITERIA_UPDATE_ALL_URL}/${studentNeedCareId}`, body)
  },
}
