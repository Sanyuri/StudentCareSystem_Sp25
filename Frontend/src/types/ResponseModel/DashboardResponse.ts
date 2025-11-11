import { ApplicationTypeResponse } from './ApplicationTypeResponse'

export type DashboardStudentAttendanceResponse = {
  totalReminds: number
  previousPeriodDifferenceRate: number
}

export type DashboardTotalApplicationsResponse = {
  totalReceivedApplication: number
  totalReturnedApplication: number
  applicationTypes: ApplicationTypeResponse[]
}

export type DashboardApplicationByTimeResponse = {
  totalReceived: number
  totalReturned: number
  createdAt: string
  status: string
}

export type DashboardStudentReminderResponse = {
  createdAt: string
  total: number
}

export type DashboardStudentCaredResponse = {
  totalStudentNeedCare: number
  previousPeriodDifferenceRate: number
  totalStudentNotAssigned: number
  totalStudentDoing: number
  totalStudentTodo: number
  totalStudentCared: number
}

export type DashboardEmailLogsByTimeResponse = {
  totalEmail: number
  createdAt: string
  emailState: string
}
