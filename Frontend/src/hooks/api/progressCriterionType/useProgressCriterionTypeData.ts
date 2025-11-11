import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ProgressCriterionTypeService } from '#src/services/ProgressCriterionTypeService.js'

export const useProgressCriterionTypeData = () => {
  return useQuery({
    queryKey: ['ProgressCriterionTypeList'],
    queryFn: () => ProgressCriterionTypeService.getAll(),
    placeholderData: keepPreviousData,
  })
}
