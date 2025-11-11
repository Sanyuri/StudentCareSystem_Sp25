export type CreateStudentApplicationRequest = {
  studentCode?: string
  email?: string
  dateReceived?: string
  dueDate?: Date
  status?: string
  applicationTypeId?: string
  emailLogId?: string
}
