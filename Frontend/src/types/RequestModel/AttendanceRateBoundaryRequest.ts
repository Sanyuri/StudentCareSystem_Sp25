export type AttendanceRateBoundaryRequest = {
  minAbsenceRate: number
  maxAbsenceRate: number
  emailSampleId: string
  isActive: boolean
}

export type UpdateAttendanceRateBoundaryRequest = {
  id: string
  minAbsenceRate: number
  maxAbsenceRate: number
  emailSampleId: string
  isActive: boolean
}
