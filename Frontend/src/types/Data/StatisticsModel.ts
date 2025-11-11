export type WeeklyAttendanceRemindersData = {
  Monday?: number
  Tuesday?: number
  Wednesday?: number
  Thursday?: number
  Friday?: number
  Saturday?: number
  Sunday?: number
}

export type MonthlyYearlyAttendanceRemindersData = {
  //Key: day in month, number: reminders count
  [key: number]: number
}

export type YearlyAttendanceRemindersBySemesterData = {
  [key: string]: number
}

export type StatisticCountData = {
  count: number
}

export type GetLastUpdatedData = {
  lastUpdated: string
}

export type LastUpdatedData = {
  lastUpdated: string
}
