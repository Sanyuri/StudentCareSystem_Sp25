import { SubjectService } from '#src/services/SubjectService.js'
import { Subject } from '#src/types/RequestModel/SubjectRequest.js'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useSubjectData = (query: string, pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ['subject', query, pageNumber, pageSize],
    queryFn: () => SubjectService.list({ query, pageNumber, pageSize }),
    placeholderData: keepPreviousData,
  })
}
export const useAddSubjectData = (query: string, pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ['add-subject', query, pageNumber, pageSize],
    queryFn: () => SubjectService.addlist({ query, pageNumber, pageSize }),
    placeholderData: keepPreviousData,
  })
}

export const useDetailSubjectData = (SubjectRequest: Subject) => {
  return useQuery({
    queryKey: ['subject-detail', SubjectRequest.id],
    queryFn: () => SubjectService.detail(SubjectRequest),
    placeholderData: keepPreviousData,
    enabled: !!SubjectRequest.id,
  })
}
