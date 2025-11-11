import { StudentProgress } from '#types/Enums/StudentProgress.js'

export interface StudentModel {
  id: string
  studentName: string
  studentCode: string
  class: string
  major: string
  email: string
  isCurrentSemester: boolean
  gender: string
  progress: string
  statusCode: StudentProgress
  currentTermNo: number
  specialization: string
  mobilePhone: string
  parentPhone: string
}

export interface StudentNoteModel {
  studentName: string
  studentCode: string
}
