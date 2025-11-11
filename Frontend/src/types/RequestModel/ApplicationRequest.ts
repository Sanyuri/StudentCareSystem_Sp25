export type ApplicationRequest = {
  SearchTerm?: string
  ApplicationTypeId: string
  DateFrom?: Date
  DateTo?: Date
  Status: FilterApplication
  pageNumber?: number
  pageSize?: number
}

export type FilterTime = '' | 'today' | 'this-week' | 'this-month' | 'this-year' | 'date-range'

export type FilterApplication = '' | 'Receive' | 'Return'

export type ApplicationDeleteRequest = {
  id: string
}
