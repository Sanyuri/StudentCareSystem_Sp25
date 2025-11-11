import { WeeklyAttendanceRemindersData } from '#src/types/Data/StatisticsModel.js'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const WeeklyAttendanceReminderBarChart = ({
  data,
  isVisible,
}: {
  data: WeeklyAttendanceRemindersData
  isVisible: boolean
}) => {
  const { t } = useTranslation()

  const processData = (data: WeeklyAttendanceRemindersData) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return weekDays.map((day) => ({
      day: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.WEEKLY.' + day.toUpperCase()),
      value: data[day as keyof WeeklyAttendanceRemindersData] ?? 0,
    }))
  }

  const chartData = processData(data)
  return isVisible ? (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='day' />
          <YAxis
            label={{
              value: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.YLABEL'),
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
          <Bar dataKey='value' fill='#8884d8' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  ) : null
}

export default WeeklyAttendanceReminderBarChart
