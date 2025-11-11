import { StudentModel } from '../Data/StudentModel'

export type EmailLogResponse = {
  id: string
  recipientEmail: string
  subject: string
  content: string
  ccEmails: string
  bccEmails: string
  replyToEmail: string
  semesterName: string
  emailType: string
  entityId: string
  studentCode: string
  emailState: string
  identifierCode: string
  createdAt: string
  student: StudentModel
}

export type EmailLogListResponse = {
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: EmailLogResponse[]
}
