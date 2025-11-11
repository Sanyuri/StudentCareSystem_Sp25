import { DashboardService } from '#src/services/DashboardService.js'
import { DashboardStudentReminderRequest } from '#src/types/RequestModel/DashboardRequest.js'
import { useQuery } from '@tanstack/react-query'

export const useWeeklyRemindersStatisticData = (request: DashboardStudentReminderRequest) => {
  return useQuery({
    queryKey: ['weeklyReminders', request],
    queryFn: () => DashboardService.getWeeklyRemindersStatistic(request),
    enabled: !!request.fromDate && !!request.toDate,
  })
}
