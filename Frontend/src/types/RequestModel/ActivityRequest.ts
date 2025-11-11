export type ActivityRequest = {
  fromDate?: Date
  toDate?: Date
  activityType: FilterActivity
  email?: string
  currentPage?: number
  pageSize?: number
}

export type FilterTime = '' | 'today' | 'this-week' | 'this-month' | 'this-year' | 'date-range'

export type FilterActivity =
  | ''
  | 'Login'
  | 'Logout'
  | 'SendEmail'
  | 'Note'
  | 'Application'
  | 'EmailSample'
  | 'FreeSubject'
  | 'User'
