import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'
import { CurrentUserResponse } from '#types/ResponseModel/ApiResponse.js'

export type StudentCareAssignmentStatusCount = {
  user: CurrentUserResponse
  careStatusCount: Record<StudentCareStatus, number>
}

export type StudentCareAssignmentPercent = {
  userId: string
  percentage: number
}
