import { BaseService } from './BaseService'
import { ADD_STUDENT_APPLICATION_URL } from '#utils/constants/api.js'

export const StudentApplicationService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addStudentApplication: async (studentApplcation: any) => {
    await BaseService.post(ADD_STUDENT_APPLICATION_URL, studentApplcation)
  },
}
