export type SubjectRequest = {
  pageNumber?: number
  pageSize?: number
  query?: string
}

export type AddSubjectRequest = {
  studentSubjectIds: string[]
}

export type UpdateSubjectRequest = {
  id: string
  englishName: string
  vietnameseName: string
}

export type Subject = {
  id: string
}

export type DeleteSubjectStudent = {
  id: string
  takeAttendance: boolean
}

export type DeleteSubjectRequest = {
  id: string
  englishName: string
  vietnameseName: string
}
