import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { PsychologyNoteService } from '#src/services/PsychologyNoteService.js'

export const usePsychologyNoteData = (param: string) => {
  return useQuery({
    queryKey: ['PsychologyNote', param],
    queryFn: () => PsychologyNoteService.detail(param),
    placeholderData: keepPreviousData,
    enabled: false,
  })
}

export const useStudentPsychologyData = (param: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['Psychology', param],
    queryFn: () => PsychologyNoteService.studentInfo(param),
    placeholderData: keepPreviousData,
    enabled: !!param && enabled,
  })
}
