import { BaseService } from './BaseService'
import { DASHBOARD_DATA_URL } from '#utils/constants/api.js'
import {
  DashboardApplicationByTimeResponse,
  DashboardEmailLogsByTimeResponse,
  DashboardStudentAttendanceResponse,
  DashboardStudentCaredResponse,
  DashboardStudentReminderResponse,
  DashboardTotalApplicationsResponse,
} from '#src/types/ResponseModel/DashboardResponse.js'
import { DashboardStudentReminderRequest } from '#src/types/RequestModel/DashboardRequest.js'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'

export const DashboardService = {
  attendanceData(): Promise<DashboardStudentAttendanceResponse> {
    return BaseService.get<DashboardStudentAttendanceResponse>(
      `${DASHBOARD_DATA_URL}/student-attendance`,
    )
  },
  defermentData(): Promise<DashboardStudentAttendanceResponse> {
    return BaseService.get<DashboardStudentAttendanceResponse>(
      `${DASHBOARD_DATA_URL}/student-deferment`,
    )
  },
  failedCourseData(): Promise<DashboardStudentAttendanceResponse> {
    return BaseService.get<DashboardStudentAttendanceResponse>(
      `${DASHBOARD_DATA_URL}/student-failed-course`,
    )
  },
  totalReminderData(): Promise<DashboardStudentAttendanceResponse> {
    return BaseService.get<DashboardStudentAttendanceResponse>(
      `${DASHBOARD_DATA_URL}/student-total-reminder`,
    )
  },
  totalApplicationsData(): Promise<DashboardTotalApplicationsResponse> {
    return BaseService.get<DashboardTotalApplicationsResponse>(
      `${DASHBOARD_DATA_URL}/total-application`,
    )
  },
  applicationByTimeData(
    fromDate: string,
    toDate: string,
  ): Promise<DashboardApplicationByTimeResponse[]> {
    return BaseService.get<DashboardApplicationByTimeResponse[]>(
      `${DASHBOARD_DATA_URL}/application-by-time`,
      convertParamsGeneric({ fromDate, toDate }),
    )
  },
  getWeeklyRemindersStatistic(
    request: DashboardStudentReminderRequest,
  ): Promise<DashboardStudentReminderResponse[]> {
    return BaseService.get<DashboardStudentReminderResponse[]>(
      `${DASHBOARD_DATA_URL}/student-reminder-by-time`,
      convertParamsGeneric(request),
    )
  },
  studentCaredData(): Promise<DashboardStudentCaredResponse> {
    return BaseService.get<DashboardStudentCaredResponse>(`${DASHBOARD_DATA_URL}/student-cared`)
  },
  emailLogsByTime(fromDate: string, toDate: string): Promise<DashboardEmailLogsByTimeResponse[]> {
    return BaseService.get<DashboardEmailLogsByTimeResponse[]>(
      `${DASHBOARD_DATA_URL}/email-log-by-time`,
      convertParamsGeneric({ fromDate, toDate }),
    )
  },
}
