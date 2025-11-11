export type StudentPsychologyFilter = {
  query: string
  userId: string
  pageNumber: number
  pageSize: number
}

export type StudentPsychology = {
  studentCode: string
  accessPassword: string
}

export type StudentPsychologyByStudentCode = {
  studentCode: string
}

export type StudentPsychologyResponse = {
  id: string
  studentCode: string
  accessPassword: string
  userId: string
}

export type VerifyStudentPsychologyRequest = {
  id: string
  accessPassword: string
}

export type VerifyStudentPsychologyResponse = {
  accessToken: string
}

export type ChangePasswordRequest = {
  id: string
  oldAccessPassword: string
  newAccessPassword: string
  reNewAccessPassword: string
}

export type ForgetPasswordRequest = {
  id: string
  password: string
}
