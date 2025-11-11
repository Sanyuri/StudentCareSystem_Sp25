import { BaseService } from '#src/services/BaseService.js'
import { GetAllSemesterResponse } from '#types/ResponseModel/ApiResponse.js'
import { Semester } from '#types/Data/Semester.js'
import { GET_ALL_SEMESTER_URL, GET_CURRENT_SEMESTER_URL } from '#utils/constants/api.js'

export const SemesterService = {
  getAllSemesters(): Promise<GetAllSemesterResponse> {
    return BaseService.get<GetAllSemesterResponse>(GET_ALL_SEMESTER_URL)
  },
  getCurrentSemesters(): Promise<Semester> {
    return BaseService.get<Semester>(GET_CURRENT_SEMESTER_URL)
  },
}

export default SemesterService
