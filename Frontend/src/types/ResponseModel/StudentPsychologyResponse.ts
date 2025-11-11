import { StudentResponse } from './StudentResponse'

export type StudentPsychologyResponse = {
  id: string
  studentCode: string
  userId: string
  student: StudentResponse
}

export type StudentPsychologyListResponse = {
  lastUpdated: string
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: StudentPsychologyResponse[]
}
