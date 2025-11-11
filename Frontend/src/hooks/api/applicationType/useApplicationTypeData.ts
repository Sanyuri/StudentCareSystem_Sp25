import { ApplicationTypeService } from '#src/services/ApplicationTypeService.js'
import { ApplicationType } from '#src/types/RequestModel/ApplicationTypeRequest.js'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useApplicationTypeData = (subject: string, pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ['application-type', subject, pageNumber, pageSize],
    queryFn: () => ApplicationTypeService.list({ subject, pageNumber, pageSize }),
    placeholderData: keepPreviousData,
  })
}

export const useDetailApplicationTypeData = (ApplicationTypeRequest: ApplicationType) => {
  return useQuery({
    queryKey: ['application-type-detail', ApplicationTypeRequest.id],
    queryFn: () => ApplicationTypeService.detail(ApplicationTypeRequest),
    placeholderData: keepPreviousData,
    enabled: !!ApplicationTypeRequest.id,
  })
}
