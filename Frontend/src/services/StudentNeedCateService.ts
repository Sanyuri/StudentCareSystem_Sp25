import { mapKeys } from 'lodash'
import { BaseService } from '#src/services/BaseService.js'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import {
  GET_ALL_STUDENT_NEED_CARE_URL,
  GET_STUDENT_NEED_CARE_STATISTICS_URL,
  SCAN_STUDENT_NEED_CARE_ANALYZE,
  SCAN_STUDENT_NEED_CARE_CONFIRM,
  SCAN_STUDENT_NEED_CARE_FINAL_EVALUATE,
  SCAN_STUDENT_NEED_CARE_LIST_URL,
  SCAN_STUDENT_NEED_CARE_URL,
} from '#utils/constants/api.js'
import {
  StudentNeedCareRequest,
  StudentNeedCareUpdateRequest,
  StudentNeedCareStatusCount,
  StudentCareAddManualRequest,
  StudentCareAnalyzeRequest,
  StudentCareFinalEvaluateRequest,
} from '#types/RequestModel/StudentNeedCareRequest.js'
import {
  StudentNeedCareListResponse,
  StudentNeedCareStatusCountResponse,
} from '#types/ResponseModel/ApiResponse.js'
import { StudentNeedCareModel } from '#types/Data/StudentNeedCare.js'
import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'

export const StudentNeedCateService = {
  list: (params?: StudentNeedCareRequest): Promise<StudentNeedCareListResponse> => {
    return BaseService.get<StudentNeedCareListResponse>(
      GET_ALL_STUDENT_NEED_CARE_URL,
      convertParamsGeneric(params),
    )
  },
  careStatusCount: async (params: StudentNeedCareStatusCount) => {
    const data = await BaseService.get<StudentNeedCareStatusCountResponse>(
      GET_STUDENT_NEED_CARE_STATISTICS_URL,
      convertParamsGeneric(params),
    )
    return Object.assign(
      {},
      ...data.map((item) => mapKeys(item, (_, key) => mapApiKeyToEnum[key] ?? key)),
    )
  },
  detail: (id: string): Promise<StudentNeedCareModel> => {
    return BaseService.get<StudentNeedCareModel>(`${GET_ALL_STUDENT_NEED_CARE_URL}/${id}`)
  },
  addManual: (body: StudentCareAddManualRequest): Promise<StudentNeedCareModel> => {
    return BaseService.post<StudentNeedCareModel>(GET_ALL_STUDENT_NEED_CARE_URL, body)
  },
  update: (
    id: string,
    body?: StudentNeedCareUpdateRequest,
  ): Promise<StudentNeedCareListResponse> => {
    return BaseService.put<StudentNeedCareListResponse>(
      `${GET_ALL_STUDENT_NEED_CARE_URL}/${id}`,
      body,
    )
  },
  delete: (id: string): Promise<void> => {
    return BaseService.delete<void>(`${GET_ALL_STUDENT_NEED_CARE_URL}/${id}`)
  },
  scan: (numberOfStudentNeedCare: number): Promise<void> => {
    return BaseService.post<void>(SCAN_STUDENT_NEED_CARE_URL, { numberOfStudentNeedCare })
  },
  scanList: (params?: StudentNeedCareRequest): Promise<StudentNeedCareListResponse> => {
    return BaseService.get<StudentNeedCareListResponse>(
      SCAN_STUDENT_NEED_CARE_LIST_URL,
      convertParamsGeneric(params),
    )
  },
  deleteScan: (studentCode: string): Promise<void> => {
    return BaseService.delete<void>(`${SCAN_STUDENT_NEED_CARE_LIST_URL}/${studentCode}`)
  },
  confirm: (): Promise<void> => {
    return BaseService.post<void>(SCAN_STUDENT_NEED_CARE_CONFIRM)
  },
  analyze: (body?: StudentCareAnalyzeRequest): Promise<void> => {
    return BaseService.post<void>(SCAN_STUDENT_NEED_CARE_ANALYZE, body)
  },
  finalEvaluate: (
    id: string,
    body?: StudentCareFinalEvaluateRequest,
  ): Promise<StudentNeedCareModel> => {
    return BaseService.put<StudentNeedCareModel>(
      `${SCAN_STUDENT_NEED_CARE_FINAL_EVALUATE}/${id}`,
      body,
    )
  },
}

export const mapApiKeyToEnum: Record<string, StudentCareStatus> = {
  doing: StudentCareStatus.Doing,
  todo: StudentCareStatus.Todo,
  done: StudentCareStatus.Done,
  notAssigned: StudentCareStatus.NotAssigned,
}
