import { ActivityService } from '#src/services/ActivityService.js'
import { FilterActivity } from '#src/types/RequestModel/ActivityRequest.js'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useActivityData = (
  fromDate: Date,
  toDate: Date,
  activityType: FilterActivity,
  email?: string,
  currentPage?: number,
  pageSize?: number,
) => {
  return useQuery({
    queryKey: ['activityData', email, fromDate, toDate, activityType, currentPage, pageSize],
    queryFn: () =>
      ActivityService.list({ email, fromDate, toDate, activityType, currentPage, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  })
}
