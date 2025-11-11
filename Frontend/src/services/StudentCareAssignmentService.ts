import { BaseService } from '#src/services/BaseService.js'
import {
  STUDENT_NEED_CARE_ASSIGNMENT_AUTO_ASSIGN_PERCENT_URL,
  STUDENT_NEED_CARE_ASSIGNMENT_AUTO_ASSIGN_URL,
  STUDENT_NEED_CARE_ASSIGNMENT_STATISTICS_URL,
  STUDENT_NEED_CARE_ASSIGNMENT_URL,
} from '#utils/constants/api.js'
import { mapKeys } from 'lodash'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import {
  AddStudentCareAssignmentRequest,
  StudentCareAssignmentPercentRequest,
  StudentCareAssignmentStatusCountRequest,
  UpdateStudentCareAssignmentRequest,
} from '#types/RequestModel/StudentCareAssignment.js'
import { StudentCareAssignmentStatusCountResponse } from '#types/ResponseModel/ApiResponse.js'
import { mapApiKeyToEnum } from '#src/services/StudentNeedCateService.js'
import { StudentCareAssignmentStatusCount } from '#types/Data/StudentCareAssignment.js'
import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'

export const StudentCareAssignmentService = {
  autoAssignWithPercent: (body: StudentCareAssignmentPercentRequest) => {
    return BaseService.post<string>(`${STUDENT_NEED_CARE_ASSIGNMENT_AUTO_ASSIGN_PERCENT_URL}`, body)
  },
  autoAssign: (): Promise<string> => {
    return BaseService.post<string>(STUDENT_NEED_CARE_ASSIGNMENT_AUTO_ASSIGN_URL)
  },
  createAssign: (body?: AddStudentCareAssignmentRequest) => {
    return BaseService.post<string>(STUDENT_NEED_CARE_ASSIGNMENT_URL, body)
  },
  updateAssign: (body?: UpdateStudentCareAssignmentRequest) => {
    return BaseService.put<string>(STUDENT_NEED_CARE_ASSIGNMENT_URL, body)
  },
  careStatusCount: async (params: StudentCareAssignmentStatusCountRequest) => {
    const data: StudentCareAssignmentStatusCountResponse =
      await BaseService.get<StudentCareAssignmentStatusCountResponse>(
        STUDENT_NEED_CARE_ASSIGNMENT_STATISTICS_URL,
        convertParamsGeneric(params),
      )
    return data.map((item: StudentCareAssignmentStatusCount) => ({
      ...item,
      careStatusCount: {
        ...defaultCareStatus,
        ...mapKeys(item.careStatusCount, (_, key) => mapApiKeyToEnum[key] ?? key),
      },
    }))
  },
}
const defaultCareStatus: Record<StudentCareStatus, number> = {
  Doing: 0,
  Todo: 0,
  Done: 0,
  NotAssigned: 0,
}
