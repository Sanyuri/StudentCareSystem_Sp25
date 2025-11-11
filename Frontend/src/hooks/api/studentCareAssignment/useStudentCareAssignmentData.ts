import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { StudentCareAssignmentService } from '#src/services/StudentCareAssignmentService.js'
import { StudentCareAssignmentStatusCountRequest } from '#types/RequestModel/StudentCareAssignment.js'

export const useStudentCareAssignmentData = (
  studentCareAssignmentCountRequest: string | undefined,
  enabled: boolean = true,
) => {
  const requestParams: StudentCareAssignmentStatusCountRequest = {
    semesterName: studentCareAssignmentCountRequest,
  }
  return useQuery({
    queryKey: ['student-care-assignment', requestParams],
    queryFn: () => StudentCareAssignmentService.careStatusCount(requestParams),
    placeholderData: keepPreviousData,
    enabled,
  })
}
