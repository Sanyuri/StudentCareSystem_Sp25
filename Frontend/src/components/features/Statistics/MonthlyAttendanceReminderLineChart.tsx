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

const MonthlyAttendanceReminderLineChart = ({
  data,
  month,
  year,
  isVisible,
}: {
  data: MonthlyYearlyAttendanceRemindersData
  month: number
  year: number
  isVisible: boolean
}) => {
  const { t } = useTranslation()

  const processMonthlyData = (
    data: MonthlyYearlyAttendanceRemindersData,
    month: number,
    year: number,
  ) => {
    const getDaysInMonth = (month: number, year: number): number => {
      return new Date(year, month, 0).getDate()
    }

    return Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 1).map((day) => ({
      day,
      //Default is 0
      value: data[day] || 0,
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
          <p className='label'>{`${t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.MONTHLY.TOOLTIP.LABEL')}: ${label}`}</p>
          <p className='value'>{`${t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.MONTHLY.TOOLTIP.VALUE')}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  const chartData = processMonthlyData(data, month, year)

  return isVisible ? (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='day'
            label={{
              value: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.MONTHLY.XAXIS'),
              position: 'insideBottom',
              offset: -5,
            }}
          />
          <YAxis
            label={{
              value: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.MONTHLY.YAXIS'),
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

export default MonthlyAttendanceReminderLineChart
