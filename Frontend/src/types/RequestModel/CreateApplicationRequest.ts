export type CreateApplicationRequest = {
  studentCode?: string
  emailSubject?: string
  ccEmails?: string[]
  bccEmails?: string[]
  replyToEmail?: string
  emailContent?: string
  dueDate?: Date
  status?: string
  applicationTypeId?: string
  emailLogId?: string
}
