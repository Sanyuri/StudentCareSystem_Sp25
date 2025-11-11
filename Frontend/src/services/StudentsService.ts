import { BaseService } from '#src/services/BaseService.js'
import { StudentListResponse } from '#types/ResponseModel/ApiResponse.js'
import { StudentRequest } from '#types/RequestModel/AttendanceRequest.js'
import { StudentResponse } from '#src/types/ResponseModel/StudentResponse.js'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import { GET_ALL_STUDENT_URL, STUDENT_API_URL } from '#utils/constants/api.js'

export const StudentsService = {
  list: (params?: StudentRequest): Promise<StudentListResponse> => {
    return BaseService.get<StudentListResponse>(GET_ALL_STUDENT_URL, convertParamsGeneric(params))
  },
  getStudentById: async (studentCode: string): Promise<StudentResponse> => {
    return await BaseService.get<StudentResponse>(`${STUDENT_API_URL}/${studentCode}`)
  },
}
