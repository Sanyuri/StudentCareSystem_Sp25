import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ProgressCriteriaService } from '#src/services/ProgressCriteriaService.js'

export const useProgressCriteriaData = (id: string) => {
  return useQuery({
    queryKey: ['progressCriteriaList'],
    queryFn: () => ProgressCriteriaService.getByStudentCare(id),
    placeholderData: keepPreviousData,
  })
}
