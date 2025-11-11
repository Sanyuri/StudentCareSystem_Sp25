import { BaseService } from '#src/services/BaseService.js'
import { STUDENT_POINT_URL } from '#utils/constants/api.js'
import { StudentPointDetailRequest } from '#types/RequestModel/StudentPoint.js'
import { StudentPointDetailResponse } from '#types/ResponseModel/ApiResponse.js'

export const StudentPointService = {
  getByStudent: (
    studentCode: string | undefined,
    params?: StudentPointDetailRequest,
  ): Promise<StudentPointDetailResponse[]> => {
    const urlParams = new URLSearchParams()
    params?.semesterName.forEach((semester) => urlParams.append('semesters', semester))
    return BaseService.get<StudentPointDetailResponse[]>(
      `${STUDENT_POINT_URL}/${studentCode}`,
      urlParams,
    )
  },
}
