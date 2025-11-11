import { StatisticsService } from '#src/services/StatisticsService.js'
import { useQuery } from '@tanstack/react-query'

export const useSemesterRemindersCount = (semesterName: string) => {
  return useQuery({
    queryKey: ['semesterReminders', semesterName],
    queryFn: () => StatisticsService.getSemesterRemindersCount(semesterName),
    enabled: !!semesterName, // Only fetch if semesterName is defined
  })
}
