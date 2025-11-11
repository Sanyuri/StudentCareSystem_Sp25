import { StudentDeferService } from '#src/services/DeferService.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useDeferData = (
  query: string,
  //filter:
  semesters: string | undefined,
  pageNumber: number,
  pageSize: number,
) => {
  return useQuery({
    queryKey: ['student-defer', query, semesters, pageNumber, pageSize],
    queryFn: () =>
      StudentDeferService.list({
        query,
        semesters,
        pageNumber,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  })
}

export const useLastUpdatedData = () => {
  return useQuery({
    queryKey: ['last-updated-defer'],
    queryFn: () => StudentDeferService.getLastUpdatedData(),
    placeholderData: keepPreviousData,
  })
}
