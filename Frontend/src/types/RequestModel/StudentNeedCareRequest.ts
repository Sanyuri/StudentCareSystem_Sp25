export type StudentNeedCareFilterRequest = {
  query?: string
  rank?: number
  isCollaborating?: boolean
  isProgressing?: boolean
  needsCareNextTerm?: boolean
  careStatus?: string
  userId?: string
  semesterName?: string
}

export type StudentNeedCareRequest = StudentNeedCareFilterRequest & {
  pageNumber: number
  pageSize: number
}

export type StudentCareAnalyzeRequest = {
  semesterName: string
}

export type StudentNeedCareUpdateRequest = {
  id: string
  needsCareNextTerm?: boolean
  isProgressing?: boolean
  isCollaborating?: boolean
  careStatus?: string
  semesterName?: string
  finalComment?: string
}

export type StudentCareFinalEvaluateRequest = {
  id: string
  needsCareNextTerm?: boolean
  isProgressing?: boolean
  isCollaborating?: boolean
  careStatus?: string
  finalComment?: string
}

export type StudentNeedCareStatusCount = {
  semesterName: string | undefined
}

export type StudentCareAddManualRequest = {
  studentCode: string
}
