import { EmailState } from '../Enums/EmailState'
import { EmailType } from '../Enums/EmailType'

export type EmailLogRequest = {
  searchValue: string
  emailState: EmailState | ''
  emailType: EmailType | ''
  minCreatedDate?: Date
  maxCreatedDate?: Date
  pageNumber: number
  pageSize: number
  semesterName: string
}
