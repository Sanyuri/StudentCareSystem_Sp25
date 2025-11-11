import { MonthlyYearlyAttendanceRemindersData } from '#src/types/Data/StatisticsModel.js'
import { useTranslation } from 'react-i18next'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const processYearlyData = (data: MonthlyYearlyAttendanceRemindersData) => {
  return Array.from({ length: 12 }, (_, i) => i + 1).map((month) => ({
    month,
    value: data[month] || 0,
  }))
}
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className='custom-tooltip'
        style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}
      >
        <p className='label'>{`Month: ${label}`}</p>
        <p className='value'>{`Reminders: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

const YearlyAttendanceReminderLineChart = ({
  data,
  isVisible,
}: {
  data: MonthlyYearlyAttendanceRemindersData
  isVisible: boolean
}) => {
  const { t } = useTranslation()

  const chartData = processYearlyData(data)

  return isVisible ? (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='month'
            label={{
              value: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.YEARLY.MODE.MONTH.XAXIS'),
              position: 'insideBottom',
              offset: -5,
            }}
            tickFormatter={(tick) => `${tick}`}
          />
          <YAxis
            label={{
              value: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.YEARLY.YAXIS'),
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type='monotone' dataKey='value' stroke='#8884d8' activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ) : null
}

export default YearlyAttendanceReminderLineChart
