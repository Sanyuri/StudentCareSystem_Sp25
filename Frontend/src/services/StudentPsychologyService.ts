import {
  ChangePasswordRequest,
  ForgetPasswordRequest,
  StudentPsychology,
  StudentPsychologyByStudentCode,
  StudentPsychologyFilter,
  StudentPsychologyResponse,
  VerifyStudentPsychologyRequest,
  VerifyStudentPsychologyResponse,
} from '#src/types/RequestModel/StudentPsychologyRequest.js'
import { BaseService } from './BaseService'
import {
  STUDENT_PSYCHOLOGY_BY_STUDENT_CODE_URL,
  STUDENT_PSYCHOLOGY_CHANGE_PASSWORD,
  STUDENT_PSYCHOLOGY_URL,
  STUDENT_PSYCHOLOGY_VERIFY_URL,
} from '#utils/constants/api.js'
import { StudentPsychologyListResponse } from '#src/types/ResponseModel/StudentPsychologyResponse.js'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'

export const StudentPsychologyService = {
  addStudentPsychology: (params: StudentPsychology): Promise<StudentPsychologyResponse> => {
    return BaseService.post<StudentPsychologyResponse>(STUDENT_PSYCHOLOGY_URL, params)
  },
  getStudentPsychology: (
    params: StudentPsychologyByStudentCode,
  ): Promise<StudentPsychologyResponse> => {
    return BaseService.get<StudentPsychologyResponse>(
      `${STUDENT_PSYCHOLOGY_BY_STUDENT_CODE_URL}/${params.studentCode}`,
    )
  },
  verifyStudentPsychology: (
    params: VerifyStudentPsychologyRequest,
  ): Promise<VerifyStudentPsychologyResponse> => {
    return BaseService.post<VerifyStudentPsychologyResponse>(
      `${STUDENT_PSYCHOLOGY_VERIFY_URL}`,
      params,
    )
  },
  getAll: (filter: StudentPsychologyFilter): Promise<StudentPsychologyListResponse> => {
    return BaseService.get<StudentPsychologyListResponse>(
      STUDENT_PSYCHOLOGY_URL,
      convertParamsGeneric(filter),
    )
  },
  changePassword: (params: ChangePasswordRequest): Promise<void> => {
    return BaseService.put<void>(`${STUDENT_PSYCHOLOGY_CHANGE_PASSWORD}/${params.id}`, params)
  },
  forgetPassword: (params: ForgetPasswordRequest): Promise<void> => {
    return BaseService.put<void>(`${STUDENT_PSYCHOLOGY_URL}/forget-password/${params.id}`, params)
  },
}
