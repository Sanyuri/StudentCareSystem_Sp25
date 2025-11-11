import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AttendanceFilter } from '#src/types/RequestModel/AttendanceRequest.js'
import { AttendanceService } from '#src/services/AttendanceService.js'
import { AttendanceDetailRequest } from '#types/RequestModel/AttendanceRequest.js'

export const useAttendanceData = (
  query: string,
  filter: AttendanceFilter,
  pageNumber: number,
  pageSize: number,
) => {
  return useQuery({
    queryKey: ['scan-attendance', query, filter, pageNumber, pageSize],
    queryFn: () => AttendanceService.list({ query, filter, pageNumber, pageSize }),
    placeholderData: keepPreviousData,
  })
}

export const useLastUpdatedData = () => {
  return useQuery({
    queryKey: ['last-updated-attendance'],
    queryFn: () => AttendanceService.getLastUpdatedData(),
    placeholderData: keepPreviousData,
  })
}

export const useAttendanceDetailData = (
  studentCode: string | undefined,
  params: AttendanceDetailRequest,
) => {
  return useQuery({
    queryKey: ['attedance-detail', studentCode, params],
    queryFn: () => AttendanceService.getDetail(studentCode, params),
    placeholderData: keepPreviousData,
    enabled: !!studentCode,
  })
}
