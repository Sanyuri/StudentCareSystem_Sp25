export type SubjectResp = {
  id: string
  subjectCode: string
  subjectGroup: string
  vietnameseName: string
  englishName: string
}
export type SubjectResponse = {
  id: string
  subjectCode: string
  subjectGroup: string
  vietnameseName: string
  englishName: string
}
export type SubjectDetailResponse = {
  id: string
  subjectCode: string
  subjectGroup: string
  vietnameseName: string
  englishName: string
  takeAttendance: boolean
  replacedBy: string
  isGraded: boolean
  isBeforeOjt: boolean
  isRequired: boolean
}

export type SubjectListResponse = {
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: SubjectResponse[]
}
