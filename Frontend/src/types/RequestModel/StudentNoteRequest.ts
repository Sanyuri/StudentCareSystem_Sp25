import { NotifyRequest } from './NotifyRequest'

export type AttendanceRequest = {
  query: string
  filter?: AttendanceFilter
  pageNumber: number
  pageSize: number
}

export type AttendanceFilter = {
  minAbsenceRate?: number
  maxAbsenceRate?: number
  studentClass?: string
  totalAbsences?: number
  semester?: number
  major?: string
  minEmailHistory?: Date
  maxEmailHistory?: Date
  hasNoted?: boolean
}

export type NotifyToStudent = {
  userId: string
  type: string
  values: NotifyRequest
}

export type NoteRequest = {
  query: string
  noteTypeId?: string
  pageNumber: number
  pageSize: number
}

export type NoteFilter = {
  noteTypeId?: string
  query?: string
}

export type AddNoteRequest = {
  englishName: string
  vietnameseName: string
}

export type UpdateNoteRequest = {
  id: string
  content: string
  entityId: string
  studentCode: string
}

export type Note = {
  id: string
}

export type DeleteNoteRequest = {
  id: string
  studentCode: string
  studentName: string
}
