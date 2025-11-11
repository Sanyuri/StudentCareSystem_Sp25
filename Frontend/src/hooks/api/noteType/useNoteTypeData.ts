import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { NoteTypeService } from '#src/services/NoteTypeService.js'

export const useNoteTypeData = (param: string) => {
  return useQuery({
    queryKey: ['NoteTypeList', param],
    queryFn: () => NoteTypeService.getAllNoteType(param),
    placeholderData: keepPreviousData,
  })
}

export const useNoteTypeDefaultData = (param: string) => {
  return useQuery({
    queryKey: ['NoteTypeDefaultList', param],
    queryFn: () => NoteTypeService.getAllDefaultNoteType(param),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  })
}
