export type CreateUserRequest = {
  id: string
  email: string
  feEmail?: string
  fullName: string
  roleId: string
  majorIds: Set<string>
  permissionIds: Set<string>
}

export type UserDetailsRequest = {
  id: string
}

export type CreateNoteRequest = {
  content: string
  noteTypeId: string | undefined
  entityId: string | null
  studentCode: string | undefined
  channel: string | undefined
  processingTime: string | undefined
}

export type CreateNoteExcelRequest = {
  content: string
  noteTypeId: string | null
  entityId: string | null
  studentCode: string
  createdBy: string
  semesterName: string
  channel: string | undefined
  processingTime: string | undefined
}

export type CreateNoteListRequest = CreateNoteExcelRequest[]

export type UpdateNoteRequest = {
  id: string
  content: string
  noteTypeId: string
  entityId: string | null
  studentCode: string
  channel?: string | undefined
  processingTime?: string | undefined
}

export type CreateNoteTypeRequest = {
  vietnameseName: string
  englishName: string
}

export type UpdateNoteTypeRequest = {
  id: string
  vietnameseName: string
  englishName: string
}

export type UpdatePsychologyNoteTypeRequest = {
  id: string
  vietnameseName: string
  englishName: string
}

export type CreatePsychologyNoteTypeRequest = {
  vietnameseName: string
  englishName: string
}

export type PsychologyNoteDetailInput = {
  content: string
  psychologyNoteTypeId: string
}

export type CreatePsychologyNoteRequest = {
  studentPsychologyId: string
  psychologyNoteDetails: PsychologyNoteDetailInput[]
  subject: string
}
export type CreateNoteDetailRequest = {
  englishName: string
  vietnameseName: string
}

export type UpdateNoteDetailRequest = {
  id: string
  englishName: string
  vietnameseName: string
}

export type UpdateRolePermission = {
  id: string
  vietnameseName: string
  englishName: string
  permissionIds: string[]
}

export type AddNewEmailDeferRequest = {
  emailSampleId: string
  fromDate: Date
  toDate: Date
}

export type BasePagingFilterRequest = {
  pageNumber: number
  pageSize: number
}

export type UpdateDriveFilePsychologyNoteRequest = {
  id: string
  driveUrl: string
}

export type AddNewEmailFailRequest = {
  emailSampleId: string
  semesterName: string
}
