import {
  GetLastUpdatedData,
  LastUpdatedData,
  MonthlyYearlyAttendanceRemindersData,
  StatisticCountData,
  WeeklyAttendanceRemindersData,
  YearlyAttendanceRemindersBySemesterData,
} from '#src/types/Data/StatisticsModel.js'
import {
  GET_LAST_UPDATED_URL,
  MONTHLY_REMINDERS_STATISTIC_URL,
  SEMESTER_REMINDERS_COUNT_URL,
  WEEKLY_REMINDERS_STATISTIC_URL,
  YEARLY_REMINDERS_STATISTIC_BY_SEMESTER_URL,
  YEARLY_REMINDERS_STATISTIC_URL,
} from '#utils/constants/api.js'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import { BaseService } from './BaseService'

export const StatisticsService = {
  getWeeklyRemindersStatistic(startDate: Date): Promise<WeeklyAttendanceRemindersData> {
    return BaseService.get<WeeklyAttendanceRemindersData>(
      `${WEEKLY_REMINDERS_STATISTIC_URL}`,
      convertParamsGeneric({ startDate }),
    )
  },
  getMonthlyRemindersStatistic(
    year: number,
    month: number,
  ): Promise<MonthlyYearlyAttendanceRemindersData> {
    return BaseService.get<MonthlyYearlyAttendanceRemindersData>(
      `${MONTHLY_REMINDERS_STATISTIC_URL}`,
      convertParamsGeneric({ year, month }),
    )
  },
  getYearlyRemindersStatistic(year: number): Promise<MonthlyYearlyAttendanceRemindersData> {
    return BaseService.get<MonthlyYearlyAttendanceRemindersData>(
      `${YEARLY_REMINDERS_STATISTIC_URL}`,
      convertParamsGeneric({ year }),
    )
  },
  getYearlyRemindersStatisticBySemester(
    year: number,
  ): Promise<YearlyAttendanceRemindersBySemesterData> {
    return BaseService.get<YearlyAttendanceRemindersBySemesterData>(
      `${YEARLY_REMINDERS_STATISTIC_BY_SEMESTER_URL}`,
      convertParamsGeneric({ year }),
    )
  },
  getSemesterRemindersCount(semesterName: string): Promise<StatisticCountData> {
    return BaseService.get<StatisticCountData>(
      `${SEMESTER_REMINDERS_COUNT_URL}`,
      convertParamsGeneric({ semesterName }),
    )
  },
  async getLastUpdated(): Promise<LastUpdatedData> {
    const response = await BaseService.get<GetLastUpdatedData>(`${GET_LAST_UPDATED_URL}`)
    return {
      lastUpdated: new Date(response.lastUpdated).toISOString(),
    }
  },
}
