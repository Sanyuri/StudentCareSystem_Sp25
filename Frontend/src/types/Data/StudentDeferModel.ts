import { StudentModel } from '../Data/StudentModel'
import { StudentDeferStatus } from '../Enums/StudentDeferStatus'

export type StudentDeferModel = {
  student: StudentModel
  studentCode: string
  id: string
  status: StudentDeferStatus
  studentDeferType: string
  defermentDate: Date
  endDate: Date
  startDate: Date
  updatedAt: Date
  description: string
  deferredSemesterName: string
}
