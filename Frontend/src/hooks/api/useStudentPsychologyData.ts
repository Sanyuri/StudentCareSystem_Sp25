import { StudentPsychologyService } from '#src/services/StudentPsychologyService.js'
import { StudentPsychologyFilter } from '#src/types/RequestModel/StudentPsychologyRequest.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useStudentPsychologyData = (filter: StudentPsychologyFilter) => {
  return useQuery({
    queryKey: [
      'student-psychology',
      filter.query,
      filter.userId,
      filter.pageNumber,
      filter.pageSize,
    ],
    queryFn: () => StudentPsychologyService.getAll(filter),
    placeholderData: keepPreviousData,
    staleTime: 20000,
  })
}
