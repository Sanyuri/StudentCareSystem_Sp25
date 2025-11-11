export type StudentNoteResponse = {
  id: string
  content: string
  noteType: NoteType
  student: Student
  studentCode: string
  semesterName: string
  entityId: string
  createdAt: string
  updatedAt: string | null
  createdBy: string
  updatedBy: string | null
  channel: string | undefined
  processingTime: string | undefined
}
export type NoteType = {
  id: string
  vietnameseName: string
  englishName: string
  defaultNoteType: string
  createdAt: Date
  updatedAt: Date
}

export type Student = {
  studentName: string
  studentCode: string
  class: string
  major: string
  email: string
  isCurrentSemester: boolean
  gender: string
  progress: string
  statusCode: string
  currentTermNo: number
  specialization: string
  mobilePhone: string
  parentPhone: string
}
