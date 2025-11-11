import { BaseService } from '#src/services/BaseService.js'
import {
  AttendanceHistoryResponse,
  AttendanceRateBoundaryResponse,
} from '#types/ResponseModel/ApiResponse.js'
import {
  AttendanceRateBoundaryRequest,
  UpdateAttendanceRateBoundaryRequest,
} from '#types/RequestModel/AttendanceRateBoundaryRequest.js'
import { ATTENDANCE_RATE_BOUNDARY_URL, ATTENDANCE_HISTORY_URL } from '#utils/constants/api.js'

export const AttendanceRateBoundaryService = {
  list: (): Promise<AttendanceRateBoundaryResponse> => {
    return BaseService.get<AttendanceRateBoundaryResponse>(ATTENDANCE_RATE_BOUNDARY_URL)
  },
  add(param: AttendanceRateBoundaryRequest): Promise<AttendanceRateBoundaryResponse> {
    return BaseService.post<AttendanceRateBoundaryResponse>(ATTENDANCE_RATE_BOUNDARY_URL, param)
  },
  update(body: UpdateAttendanceRateBoundaryRequest): Promise<void> {
    return BaseService.put<void>(`${ATTENDANCE_RATE_BOUNDARY_URL}/${body.id}`, body)
  },
  delete(param: string): Promise<void> {
    return BaseService.delete<void>(`${ATTENDANCE_RATE_BOUNDARY_URL}/${param}`)
  },
  history: (param: string): Promise<AttendanceHistoryResponse[]> => {
    return BaseService.get<AttendanceHistoryResponse[]>(`${ATTENDANCE_HISTORY_URL}/${param}`)
  },
}
