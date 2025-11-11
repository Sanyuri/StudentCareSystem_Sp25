import { EmailTemplateResponse } from '#types/ResponseModel/ApiResponse.js'

export interface AttendanceRateBoundary {
  id: string
  minAbsenceRate: number
  maxAbsenceRate: number
  emailSample?: EmailTemplateResponse
  isActive: boolean
}
