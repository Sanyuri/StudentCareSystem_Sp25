import { useEffect, useState } from 'react'
import { Select, Modal, DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useWeeklyRemindersStatisticData } from '#hooks/api/statistics/useWeeklyRemindersStatisticData.js'
import { DashboardStudentReminderResponse } from '#src/types/ResponseModel/DashboardResponse.js'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ChartData {
  label: string
  totalReminder: number
}

const { Option } = Select

const mode = ['week', 'month', 'year']

const groupData = (
  data: DashboardStudentReminderResponse[],
  displayMode: string,
  selectedDate: Dayjs | null,
): ChartData[] => {
  const map: Record<string, { totalReminder: number }> = {}

  let labels: string[] = []
  if (displayMode === mode[0]) {
    // Weekly
    labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  } else if (displayMode === mode[1]) {
    // Monthly
    const daysInMonth = selectedDate ? selectedDate.daysInMonth() : 0
    labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())
  } else if (displayMode === mode[2]) {
    // Yearly
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }

  data.forEach((item) => {
    let label = ''
    if (displayMode === mode[0]) {
      label = dayjs(item.createdAt).format('dddd')
    } else if (displayMode === mode[1]) {
      label = dayjs(item.createdAt).format('D')
    } else if (displayMode === mode[2]) {
      label = dayjs(item.createdAt).format('MMM')
    }

    if (!map[label]) {
      map[label] = { totalReminder: 0 }
    }

    map[label].totalReminder += item.total
  })

  return labels.map((label) => ({
    label,
    totalReminder: map[label]?.totalReminder ?? 0,
  }))
}

const AttendanceReminderModal = ({
  type,
  isVisible,
  title,
  onClose,
}: {
  type: string | null
  title: string
  isVisible: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation()
  const [displayMode, setDisplayMode] = useState<string>(mode[0])
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())
  const [startDate, setStartDate] = useState<string>(
    dayjs().startOf('week').add(7, 'hours').toISOString(),
  )
  const [endDate, setEndDate] = useState<string>(
    dayjs().endOf('week').add(7, 'hours').toISOString(),
  )

  const [chartData, setChartData] = useState<ChartData[]>([])

  const handleDateChange = (date: Dayjs) => {
    setSelectedDate(date)
    //Get start and end date based on selected date and display mode
    handleStartDateEndDate(date, displayMode)
  }

  const handleStartDateEndDate = (date: Dayjs | null, displayMode: string) => {
    switch (displayMode) {
      case mode[1]:
        setStartDate(date?.startOf('month').add(7, 'hours').toISOString() ?? '')
        setEndDate(date?.endOf('month').add(7, 'hours').toISOString() ?? '')
        break
      case mode[2]:
        setStartDate(date?.startOf('year').add(7, 'hours').toISOString() ?? '')
        setEndDate(date?.endOf('year').add(7, 'hours').toISOString() ?? '')
        break
      default:
        setStartDate(date?.startOf('week').add(7, 'hours').toISOString() ?? '')
        setEndDate(date?.endOf('week').add(7, 'hours').toISOString() ?? '')
        break
    }
  }
  const totalReminder = chartData.reduce((acc, cur) => acc + cur.totalReminder, 0)

  const { data: reminderData } = useWeeklyRemindersStatisticData({
    fromDate: startDate,
    toDate: endDate,
    emailType: type,
  })

  const handleDisplayModeChange = (value: string) => {
    setDisplayMode(value)
    // Update selectedDate based on the new display mode
    handleStartDateEndDate(selectedDate, value)
  }

  const handlePickerMode = (displayMode: string) => {
    switch (displayMode) {
      case mode[0]:
        return 'week'
      case mode[1]:
        return 'month'
      case mode[2]:
        return 'year'
      default:
        return 'week'
    }
  }

  useEffect(() => {
    //Set selected date to null to prevent date picker from showing the wrong date
    if (!reminderData) {
      setChartData([])
      return
    }
    const groupedData = groupData(reminderData, displayMode, selectedDate)
    setChartData(groupedData)
  }, [isVisible, reminderData, displayMode, selectedDate])

  return (
    <Modal title={title} open={isVisible} onCancel={onClose} footer={null} width={900}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Select defaultValue={mode[0]} onChange={handleDisplayModeChange} style={{ width: 200 }}>
          <Option value={mode[0]}>
            {t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.WEEKLY.TITLE')}
          </Option>
          <Option value={mode[1]}>
            {t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.MONTHLY.TITLE')}
          </Option>
          <Option value={mode[2]}>
            {t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.YEARLY.TITLE')}
          </Option>
        </Select>

        {displayMode === 'weekly' && (
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            picker='week'
            className='ml-4'
          />
        )}
        {displayMode === 'monthly' && (
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            picker='month'
            className='ml-4'
          />
        )}
        {displayMode === 'yearly' && (
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            picker='year'
            className='ml-4'
          />
        )}

        {[mode[0], mode[1], mode[2]].map((m) => (
          <DatePicker
            key={m}
            value={selectedDate}
            onChange={handleDateChange}
            picker={handlePickerMode(m)}
            className='ml-4'
            style={{ display: displayMode === m ? 'block' : 'none' }}
          />
        ))}
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <div className='flex justify-start mb-4 ml-10'>
          <div className='pr-4'>
            <h3 className='text-2xl font-bold pr-3 text-center'>{totalReminder}</h3>
            <p className='text-gray-500 text-center'>
              {t('DASHBOARD.ATTENDANCE_REMINDER.TOTAL_APPLICATION')}
            </p>
          </div>
        </div>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='label' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey='totalReminder'
              fill='#4C9FF0'
              name={t('DASHBOARD.ATTENDANCE_REMINDER.TOTAL_APPLICATION')}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Modal>
  )
}

export default AttendanceReminderModal
