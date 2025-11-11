import { AttendanceRequest } from '#src/types/RequestModel/AttendanceRequest.js'
import { AttendanceListResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { convertParamsGeneric, flattenAttendanceRequest } from '#utils/helper/convertParams.js'
import {
  ATTENDANCE_DATE_URL,
  ATTENDANCE_DETAIL_URL,
  ATTENDANCE_LAST_UPDATE_URL,
  ATTENDANCE_LIST_URL,
  ATTENDANCE_SCAN_URL,
  ATTENDANCE_SEMESTER_URL,
} from '#utils/constants/api.js'
import {
  AttendanceDateFilter,
  AttendanceDetailRequest,
  AttendanceScanRequest,
  AttendanceSemesterFilter,
} from '#types/RequestModel/AttendanceRequest.js'
import { StudentAttendanceDetailResponse } from '#types/ResponseModel/ApiResponse.js'

export const AttendanceService = {
  list(params?: AttendanceRequest): Promise<AttendanceListResponse> {
    return BaseService.get<AttendanceListResponse>(
      ATTENDANCE_LIST_URL,
      convertParamsGeneric(flattenAttendanceRequest(params)),
    )
  },
  getListByDate(param: AttendanceDateFilter): Promise<AttendanceListResponse> {
    return BaseService.get<AttendanceListResponse>(ATTENDANCE_DATE_URL, convertParamsGeneric(param))
  },
  getListBySemester(param: AttendanceSemesterFilter): Promise<AttendanceListResponse> {
    return BaseService.get<AttendanceListResponse>(
      ATTENDANCE_SEMESTER_URL,
      convertParamsGeneric(param),
    )
  },
  getListByLastUpdated(param: AttendanceDateFilter): Promise<AttendanceListResponse> {
    return BaseService.get<AttendanceListResponse>(
      ATTENDANCE_LAST_UPDATE_URL,
      convertParamsGeneric(param),
    )
  },
  getLastUpdatedData(): Promise<string> {
    return BaseService.get<string>(ATTENDANCE_LAST_UPDATE_URL)
  },
  scan(params?: AttendanceScanRequest): Promise<string> {
    return BaseService.post<string>(ATTENDANCE_SCAN_URL, params)
  },
  getDetail(
    studentCode: string | undefined,
    params?: AttendanceDetailRequest,
  ): Promise<StudentAttendanceDetailResponse[]> {
    const urlParams = new URLSearchParams()
    params?.semesterName.forEach((semester) => urlParams.append('semesters', semester))
    return BaseService.get<StudentAttendanceDetailResponse[]>(
      `${ATTENDANCE_DETAIL_URL}/${studentCode}`,
      urlParams,
    )
  },
}
