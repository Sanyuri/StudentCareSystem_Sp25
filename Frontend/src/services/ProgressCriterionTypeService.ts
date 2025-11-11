import { ProgressCriterionTypeListResponse } from '#types/ResponseModel/ApiResponse.js'
import { BaseService } from '#src/services/BaseService.js'
import { PROGRESS_CRITERION_TYPE_URL } from '#utils/constants/api.js'
import {
  CreateProgressCriterionTypeRequest,
  UpdateProgressCriterionTypeRequest,
} from '#types/RequestModel/ProgressCriterionTypeRequest.js'

export const ProgressCriterionTypeService = {
  getAll: (): Promise<ProgressCriterionTypeListResponse> => {
    return BaseService.get<ProgressCriterionTypeListResponse>(PROGRESS_CRITERION_TYPE_URL)
  },

  add(body: CreateProgressCriterionTypeRequest): Promise<void> {
    return BaseService.post<void>(PROGRESS_CRITERION_TYPE_URL, body)
  },

  update(body: UpdateProgressCriterionTypeRequest): Promise<void> {
    return BaseService.put<void>(`${PROGRESS_CRITERION_TYPE_URL}/${body.id}`, body)
  },
  delete(param: string): Promise<void> {
    return BaseService.delete<void>(`${PROGRESS_CRITERION_TYPE_URL}/${param}`)
  },
}
