import { StudentFailedCourseRequest } from '#src/types/RequestModel/StudentFailedCourseRequest.js'
import {
  StudentFailedCourseDetailResponse,
  StudentFailedCoursesExportListResponse,
  StudentFailedCoursesListResponse,
} from '#types/ResponseModel/StudentFailedCourseResponse.js'
import { BaseService } from './BaseService'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import {
  GET_ALL_STUDENT_FAILED_COURSE_DETAIL_URL,
  GET_ALL_STUDENT_FAILED_COURSE_URL,
  STUDENT_FAILED_COURSE_EXPORT_URL,
} from '#utils/constants/api.js'
import { ExportStudentFailedCourseRequest } from '#src/types/RequestModel/ExportStudentFailedCourseRequest.js'

export const StudentFailedCourseService = {
  list: (params?: StudentFailedCourseRequest): Promise<StudentFailedCoursesListResponse> => {
    return BaseService.get<StudentFailedCoursesListResponse>(
      GET_ALL_STUDENT_FAILED_COURSE_URL,
      convertParamsGeneric(params),
    )
  },

  detail: (studentId: string): Promise<StudentFailedCourseDetailResponse> => {
    return BaseService.get<StudentFailedCourseDetailResponse>(
      `${GET_ALL_STUDENT_FAILED_COURSE_DETAIL_URL}/${studentId}`,
    )
  },
  getLastUpdated: (): Promise<string> => {
    return BaseService.get<string>(`${GET_ALL_STUDENT_FAILED_COURSE_URL}/last-updated-date`)
  },
  export: (
    params?: ExportStudentFailedCourseRequest,
  ): Promise<StudentFailedCoursesExportListResponse> => {
    return BaseService.get<StudentFailedCoursesExportListResponse>(
      STUDENT_FAILED_COURSE_EXPORT_URL,
      convertParamsGeneric(params),
    )
  },
}
