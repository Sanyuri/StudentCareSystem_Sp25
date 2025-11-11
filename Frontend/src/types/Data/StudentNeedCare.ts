import { StudentModel } from '#types/Data/StudentModel.js'

export type StudentNeedCareModel = {
  id: string
  studentCode: string
  semesterName: string
  rank: number
  isCollaborating: boolean
  isProgressing: boolean
  needsCareNextTerm: boolean
  careStatus: string
  finalComment: string
  student: StudentModel
  studentCareAssignments: StudentCareAssignment[]
}

export type StudentCareAssignment = {
  id: string
  studentNeedCareId: string
  user: StudentModel
}

export type SubjectStudentCareComparisonData = {
  subjectCode: string
  className: string
  totalAbsences?: number
  totalSlots?: number
  absenceRate?: number
  isIncreased?: boolean
  averageMark?: number
  isAttendanceFail?: boolean
}
export type StudentCareComparisonData = {
  studentCode: string
  semesterName: string
  subjects: SubjectStudentCareComparisonData[]
}
