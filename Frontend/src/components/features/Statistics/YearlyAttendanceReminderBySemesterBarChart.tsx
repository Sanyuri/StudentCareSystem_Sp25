import { YearlyAttendanceRemindersBySemesterData } from '#src/types/Data/StatisticsModel.js'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const YearlyAttendanceReminderBySemesterBarChart = ({
  data,
  year,
  isVisible,
}: {
  data: YearlyAttendanceRemindersBySemesterData
  year: number
  isVisible: boolean
}) => {
  const processSemesterData = (data: YearlyAttendanceRemindersBySemesterData, year: number) => {
    const semesters = [`Spring${year}`, `Summer${year}`, `Fall${year}`]
    return semesters.map((semester) => ({
      semester,
      value: data[semester] || 0,
    }))
  }

  const { t } = useTranslation()
  const chartData = processSemesterData(data, year)

  return isVisible ? (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='semester'
            label={{
              value: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.YEARLY.MODE.SEMESTER.XAXIS'),
              position: 'insideBottom',
              offset: -5,
            }}
          />
          <YAxis
            label={{
              value: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.YEARLY.YAXIS'),
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
          <Bar dataKey='value' fill='#82ca9d' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  ) : null
}

export default YearlyAttendanceReminderBySemesterBarChart
