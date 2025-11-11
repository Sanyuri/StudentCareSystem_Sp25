import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { StudentsService } from '#src/services/StudentsService.js'
import { StudentFilter } from '#types/RequestModel/AttendanceRequest.js'

export const useStudentManagementData = (
  query: string,
  filter: StudentFilter,
  pageNumber: number,
  pageSize: number,
) => {
  return useQuery({
    queryKey: ['student-list', query, filter, pageNumber, pageSize],
    queryFn: () => StudentsService.list({ query, filter, pageNumber, pageSize }),
    placeholderData: keepPreviousData,
  })
}
