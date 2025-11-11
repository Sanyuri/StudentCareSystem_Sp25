import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AttendanceRateBoundaryService } from '#src/services/AbsenceRateBoundaryService.js'

export const useAttendanceRateBoundariesData = () => {
  return useQuery({
    queryKey: ['AbsenceRateBoundaries'],
    queryFn: () => AttendanceRateBoundaryService.list(),
    placeholderData: keepPreviousData,
  })
}

export const useAttendanceHistoryData = (params: string) => {
  return useQuery({
    queryKey: ['AttendanceHistory'],
    queryFn: () => AttendanceRateBoundaryService.history(params),
    placeholderData: keepPreviousData,
    enabled: false,
  })
}
