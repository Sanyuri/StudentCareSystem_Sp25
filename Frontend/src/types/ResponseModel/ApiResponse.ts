import { MajorData } from '../Data/MajorModel'
import { PermissionData } from '../Data/PermissionData'
import { RoleData } from '../Data/RoleData'
import { TenantModel } from '../Data/TenantModel'
import { StudentModel } from '#types/Data/StudentModel.js'
import { StudentDeferModel } from '../Data/StudentDeferModel'
import { Semester } from '#types/Data/Semester.js'
import { AttendanceRateBoundary } from '#types/Data/AbsenceRateBoundary.js'
import { NoteType } from '#types/Data/NoteType.js'
import { Note } from '#types/Data/Note.js'
import { NoteModel } from '../Data/NoteModel.js'
import { ApplicationTypeResponse } from './ApplicationTypeResponse'
import { PsychologyNoteType } from '#types/Data/PsychologyNoteType.js'
import { PsychologyNoteDetail } from '#types/Data/PsychologyNote.js'
import { AppSetting } from '#types/Data/AppSetting.js'
import { StudentNeedCareModel } from '#types/Data/StudentNeedCare.js'
import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'
import { StudentCareAssignmentStatusCount } from '#types/Data/StudentCareAssignment.js'
import { ProgressCriterionType } from '#types/Data/ProgressCriterionType.js'
import { ChatBotData } from '../Data/Chatbot'
import { ProgressCriteriaData } from '../Data/ProgressCriteria'
import { AISettingsData } from '../Data/AISettingsData'
import { PointStatus } from '../Enums/PointStatus'
import { FailReason } from '../Enums/FailReason'

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
  timestamp: number
}

type BasePaging<T> = {
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: T[]
}

export type CsrfResponse = {
  $id: string
  token: string
}

export type EmailTemplateResponse = {
  id: string
  bccEmails: string[]
  ccEmails: string[]
  replyToEmail: string
  subject: string
  content: string
  emailType: string
  createdAt: Date
  updatedAt: Date
  isSystemEmail: boolean
}

export type EmailTemplateListResponse = {
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: EmailTemplateResponse[]
}

export type LoginResponse = {
  $id: string
  jwtToken: string
  refreshToken: string
  campusCode: string
  role: string
  email: string
  name: string
  image: string
}

export type RefreshTokenResponse = {
  accessToken: string
  refreshToken: string
}

export type AttendanceListResponse = {
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: StudentAttendance[]
  lastUpdated: string
}

export type StudentAttendance = {
  id: string
  className: string
  semesterName: string
  currentTermNo: number
  updatedPeriod: string
  subjectCode: string
  image: string
  totalAbsences: number
  totalSlots: number
  absenceRate: number
  student: StudentModel
  numberOfEmails: number
  isIncreased: boolean
}

export type AttendanceGetFileResponse = StudentAttendance[]

export type GetAllMajorResponse = MajorData[]

export type GetAllPermissionResponse = PermissionData[]

export type GetAllRolesResponse = RoleData[]

export type GetRolePermissionResponse = {
  id: string
  roleType: string
  vietnameseName: string
  englishName: string
  permissions: PermissionData[]
}
export type GetUserDetailResponse = {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  feEmail?: string
  fullName: string
  role: RoleData
  majors: MajorData[]
  permissions: PermissionData[]
  status: string
}

export type CurrentUserResponse = {
  id: string
  userName?: string
  fullName?: string
  email?: string
  phoneNumber?: string
  address?: string
  dob?: string
  roleName?: string
  note?: string
  majorIds?: string[]
  permissionIds?: string[]
  isEnable2Fa?: boolean
}

export type ActivityListResponse = {
  lastUpdated: string
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: ActivityList[]
}

export type ActivityList = {
  createdAt: Date
  user: AccountList
  activityTypeName: string
  description: string
}

export type AccountListResponse = {
  lastUpdated: string
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: AccountList[]
}

export type AccountList = {
  id: string
  fullName: string
  email: string
  role: Role
  totalPermissions: number
  status: string
}

export type ApplicationListResponse = {
  lastUpdated: string
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: ApplicationList[]
}

export type ApplicationList = {
  id: string
  studentCode: string
  studentName: string
  studentEmail: string
  createdAt: string
  status: string
  applicationType: string
}
export type GetApplicationDetailResponse = {
  id: string
  studentCode: string
  studentName: string
  studentEmail: string
  dateReceived: Date
  dateReturn: Date
  status: string
  applicationType: ApplicationTypeResponse
}

export type TenantsListResponse = TenantModel[]

export type StudentListResponse = {
  lastUpdated: string
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: StudentModel[]
}

export type StudentNoteListResponse = {
  lastUpdated: string
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: NoteModel[]
}

export type StudentDefersListResponse = {
  lastUpdated: string
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: StudentDeferModel[]
}

export interface ExportFileResponse {
  fileName: string
  blob: Blob
}

export type GetAllSemesterResponse = Semester[]

export interface ExportFileResponse {
  fileName: string
  blob: Blob
}

export type AttendanceRateBoundaryResponse = AttendanceRateBoundary[]

export type NoteListResponse = Note[]

export type NoteTypeListResponse = NoteType[]

export type PsychologyNoteTypeListResponse = PsychologyNoteType[]

export type PsychologyNoteListResponse = {
  id: string
  studentPsychologyId: string
  semesterName: string
  psychologyNoteDetails: PsychologyNoteDetail[]
}

export type Role = {
  id: string
  roleType: string
  vietNameseName: string
  englishName: string
  permissions: PermissionData[]
}

export type AttendanceHistoryResponse = {
  id: string
  oldTotalAbsences: number
  newTotalAbsences: number
  oldAbsenceRate: number
  newAbsenceRate: number
  isSendEmail: boolean
  studentAttendanceId: string
  createdAt: string
}

export type CreatedAt = {
  lastUpdated: string
}

export type SubEmailListResponse = BasePaging<SubEmailResponse>

export type SubEmailResponse = {
  id: string
  name: string
  vietnameseDescription: string
  englishDescription: string
  content: string
  emailType: string
}

export type AppSettingResponse = AppSetting[]

export type StudentNeedCareListResponse = BasePaging<StudentNeedCareModel>

export type StudentNeedCareStatusCountResponse = Record<StudentCareStatus, number>[]

export type StudentCareAssignmentStatusCountResponse = StudentCareAssignmentStatusCount[]

export type ProgressCriterionTypeListResponse = ProgressCriterionType[]

export type StudentPointDetailResponse = {
  id: string
  studentCode: string
  subjectCode: string
  pointStatus: PointStatus
  failReason: FailReason
  averageMark: number
  isExempt: boolean
  className: string
  semesterName: string
  startDate: string
  endDate: string
  student: StudentModel
  updatedAt: string
}

export type StudentAttendanceDetailResponse = {
  id: string
  studentCode: string
  className: string
  semesterName: string
  currentTermNo: number
  updatedPeriod: string
  subjectCode: string
  totalAbsences: number
  totalSlots: number
  absenceRate: number
  isIncreased: boolean
  student: StudentModel
}

export type GetChatBotResponse = {
  checkpoint_id: string
  messages: ChatBotData[]
}

export type ChatBotResponse = ChatBotData[]

export type GetProgressCriteriaResponse = ProgressCriteriaData[]

export type GetAISettingResponse = AISettingsData

export type StringeeTokenResponse = {
  accessToken: string
  expiresIn: number
  phoneNumber: string
}

export type UploadGoogleDriveResponse = {
  status: string
  id: string
  name: string
  size: number
  url: string
  directDownload: string
  parentFolderUrl: string
  currentFolderUrl: string
}
