import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { PsychologyNoteTypeService } from '#src/services/PsychologyNoteTypeService.js'

export const usePsychologyNoteTypeData = (param: string) => {
  return useQuery({
    queryKey: ['PsychologyNoteTypeList', param],
    queryFn: () => PsychologyNoteTypeService.getAllPsychologyNoteType(param),
    placeholderData: keepPreviousData,
  })
}
