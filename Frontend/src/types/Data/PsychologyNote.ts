import { StudentModel } from '#types/Data/StudentModel.js'

export interface PsychologyNoteType {
  id: string
  vietnameseName: string
  englishName: string
}

export interface PsychologyNoteDetail {
  id: string
  psychologyNoteId: string
  content: string
  psychologyNoteType: PsychologyNoteType
}

export interface SemesterNote {
  id: string
  studentPsychologyId: string
  semesterName: string
  subject: string
  psychologyNoteDetails: PsychologyNoteDetail[]
  createdBy: string
  createdAt: string
  updatedBy: string | null
  updatedAt: string | null
  driveURL: string
}

export interface PsychologyNotes {
  id: string
  studentPsychologyId: string
  semesterName: string
  psychologyNoteDetails: PsychologyNoteDetail[]
}

export interface StudentPsychologyResponse {
  id: string
  studentCode: string
  userId: string
  student: StudentModel
}
