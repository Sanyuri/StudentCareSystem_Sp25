import { ApplicationService } from '#src/services/ApplicationService.js'
import {
  FilterApplication,
  ApplicationDeleteRequest,
} from '#src/types/RequestModel/ApplicationRequest.js'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useApplicationData = (
  ApplicationTypeId: string,
  Status: FilterApplication,
  SearchTerm?: string,
  pageNumber?: number,
  pageSize?: number,
  DateFrom?: Date,
  DateTo?: Date,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [
      'ApplicationData',
      SearchTerm,
      DateFrom,
      DateTo,
      ApplicationTypeId,
      Status,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      ApplicationService.list({
        SearchTerm,
        DateFrom,
        DateTo,
        ApplicationTypeId,
        Status,
        pageNumber,
        pageSize,
      }),
    placeholderData: keepPreviousData,
    enabled: enabled,
  })
}

export const useApplicationDetail = (request: ApplicationDeleteRequest) => {
  return useQuery({
    queryKey: ['ApplicationDetail', request.id],
    queryFn: () => ApplicationService.getDetail(request),
    enabled: !!request.id,
  })
}
