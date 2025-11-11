import { ActivityRequest } from '#src/types/RequestModel/ActivityRequest.js'
import { ActivityListResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import { LIST_URL } from '#utils/constants/api.js'

export const ActivityService = {
  list: (params?: ActivityRequest): Promise<ActivityListResponse> => {
    return BaseService.get<ActivityListResponse>(LIST_URL, convertParamsGeneric(params))
  },
}
