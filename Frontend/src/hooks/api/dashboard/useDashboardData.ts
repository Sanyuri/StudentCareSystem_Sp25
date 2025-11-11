import { DashboardService } from '#src/services/DashboardService.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useDashboardAttendanceData = () => {
  return useQuery({
    queryKey: ['dashboardAttendanceData'],
    queryFn: () => DashboardService.attendanceData(),
    placeholderData: keepPreviousData,
  })
}

export const useDashboardDefermentData = () => {
  return useQuery({
    queryKey: ['dashboardDefermentData'],
    queryFn: () => DashboardService.defermentData(),
    placeholderData: keepPreviousData,
  })
}

export const useDashboardFailedCourseData = () => {
  return useQuery({
    queryKey: ['dashboardFailedCourseData'],
    queryFn: () => DashboardService.failedCourseData(),
    placeholderData: keepPreviousData,
  })
}

export const useDashboardTotalReminderData = () => {
  return useQuery({
    queryKey: ['dashboardTotalReminderData'],
    queryFn: () => DashboardService.totalReminderData(),
    placeholderData: keepPreviousData,
  })
}

export const useDashboardTotalApplicationsData = () => {
  return useQuery({
    queryKey: ['dashboardTotalApplicationsData'],
    queryFn: () => DashboardService.totalApplicationsData(),
    placeholderData: keepPreviousData,
  })
}

export const useDashboardApplicationByTimeData = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['dashboardApplicationByTimeData'],
    queryFn: () => DashboardService.applicationByTimeData(startDate, endDate),
    placeholderData: keepPreviousData,
    enabled: !!startDate && !!endDate,
  })
}

export const useDashboardStudentCaredData = () => {
  return useQuery({
    queryKey: ['dashboardStudentCaredData'],
    queryFn: () => DashboardService.studentCaredData(),
    placeholderData: keepPreviousData,
  })
}

export const useDashboardEmailLogsByTime = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['dashboardEmailLogsByTime'],
    queryFn: () => DashboardService.emailLogsByTime(startDate, endDate),
    placeholderData: keepPreviousData,
    enabled: !!startDate && !!endDate,
  })
}
