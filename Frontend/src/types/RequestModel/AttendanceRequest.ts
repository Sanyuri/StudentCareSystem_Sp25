import { NotifyRequest } from './NotifyRequest'
import { StudentProgress } from '#types/Enums/StudentProgress.js'
import { DateTime } from 'luxon'
import { DateValue } from '#utils/constants/date.js'

export type AttendanceRequest = {
  query: string
  filter?: AttendanceFilter
  pageNumber: number
  pageSize: number
}

export type AttendanceFilter = {
  minAbsenceRate?: number
  maxAbsenceRate?: number
  totalSlots?: number
  subjectCode?: string
  className?: string
  totalAbsences?: number
  currentTermNo?: number
  major?: string
  from?: Date
  to?: Date
  isIncreased?: boolean
}

export type NotifyToStudent = {
  userId: string
  type: string
  values: NotifyRequest
}

export type StudentRequest = {
  query: string
  filter?: StudentFilter
  pageNumber: number
  pageSize: number
}

export type StudentFilter = {
  studentClass?: string
  major?: string
  statusCode?: StudentProgress
  currentTermNo?: number
}

export type AttendanceDateFilter = {
  date: DateTime
  dateType: DateValue
  pageNumber: number
  pageSize: number
}

export type AttendanceSemesterFilter = {
  semesterName: string
  isEnglish?: boolean
  pageNumber: number
  pageSize: number
}

export type AttendanceScanRequest = {
  semesterName: string
}

export type AttendanceDetailRequest = {
  semesterName: string[]
}
