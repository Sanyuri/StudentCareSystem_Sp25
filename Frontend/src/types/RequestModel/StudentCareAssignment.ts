import { StudentCareAssignmentPercent } from '../Data/StudentCareAssignment'

export type StudentCareAssignmentStatusCountRequest = {
  semesterName: string | undefined
}

export type UpdateStudentCareAssignmentRequest = {
  id: string
  studentNeedCareId: string
  userId: string
}

export type AddStudentCareAssignmentRequest = {
  studentNeedCareId: string
  userId: string
}

export type StudentCareAssignmentPercentRequest = {
  userPercentages: StudentCareAssignmentPercent[]
}
