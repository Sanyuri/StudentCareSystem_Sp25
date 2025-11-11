export type EmailTemplateRequest = {
  currentPage?: number
  pageSize?: number
  subject?: string
  emailType: string | undefined
}

export type AddEmailTemplateRequest = {
  ccEmails: string[]
  bccEmails: string[]
  replyToEmail: string[]
  subject: string
  content: string
}

export type UpdateEmailTemplateRequest = {
  id: string
  subject: string
  content: string
  emailType: string
  ccEmails: string[]
  bccEmails: string[]
  replyToEmail: string
}

export type EmailTemplate = {
  id: string
}

export type DeleteEmailTemplateRequest = {
  id: string
  subject: string
  content: string
}
