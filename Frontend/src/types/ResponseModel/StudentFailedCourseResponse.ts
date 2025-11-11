import { StudentModel } from '../Data/StudentModel'
import { FailReason } from '../Enums/FailReason'
import { PointStatus } from '../Enums/PointStatus'

export type StudentFailedCoursesListResponse = {
  lastUpdated: string
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: StudentFailedCourseResponse[]
}

export type StudentFailedCourseResponse = {
  id: string
  studentCode: string
  subjectCode: string
  pointStatus: PointStatus
  failReason: FailReason
  averageMark: number
  isExempted: boolean
  className: string
  semesterName: string
  startDate: Date
  endDate: Date
  student: StudentModel
  updatedAt: Date
}

export type StudentFailedCoursesExportListResponse = {
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: StudentFailedCourseExportResponse[]
}

export type StudentFailedCourseExportResponse = {
  studentCode: string
  subjectCode: string
  failedSemesters: string
  passedSemesters: string
  student: StudentModel
  updatedAt: Date
}

export type StudentFailedCourseDetailResponse = {
  items: StudentFailedCourseResponse[]
}
