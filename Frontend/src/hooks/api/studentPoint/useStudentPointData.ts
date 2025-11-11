import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { StudentPointService } from '#src/services/StudentPointService.js'
import { StudentPointDetailRequest } from '#types/RequestModel/StudentPoint.js'

export const useStudentPointData = (
  studentCode: string | undefined,
  params: StudentPointDetailRequest,
) => {
  return useQuery({
    queryKey: ['student-point-detail', studentCode, params],
    queryFn: () => StudentPointService.getByStudent(studentCode, params),
    placeholderData: keepPreviousData,
    enabled: !!studentCode,
  })
}
