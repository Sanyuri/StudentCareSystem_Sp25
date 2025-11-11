import { useDashboardApplicationByTimeData } from '#hooks/api/dashboard/useDashboardData.js'
import { DashboardApplicationByTimeResponse } from '#src/types/ResponseModel/DashboardResponse.js'
import { Card, DatePicker, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { t } from 'i18next'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
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

interface ClassNameProps {
  className?: string
}

// Define ChartData interface
interface ChartData {
  label: string
  received: number
  returned: number
}

const { Option } = Select

const mode = ['week', 'month', 'year']

//Group data by display mode
const groupData = (
  data: DashboardApplicationByTimeResponse[],
  displayMode: string,
  selectedDate: Dayjs | null,
): ChartData[] => {
  const map: Record<string, { received: number; returned: number }> = {}

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
      map[label] = { received: 0, returned: 0 }
    }

    map[label].received += item.totalReceived
    map[label].returned += item.totalReturned
  })

  return labels.map((label) => ({
    label,
    received: map[label]?.received ?? 0,
    returned: map[label]?.returned ?? 0,
  }))
}

const ApplicationChart: FC<ClassNameProps> = ({ className }) => {
  const [displayMode, setDisplayMode] = useState<string>(mode[0])
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())

  const [startDate, setStartDate] = useState<string>(
    dayjs().startOf('week').add(7, 'hours').toISOString(),
  )
  const [endDate, setEndDate] = useState<string>(
    dayjs().endOf('week').add(7, 'hours').toISOString(),
  )

  const { data: applicationData, refetch } = useDashboardApplicationByTimeData(startDate, endDate)
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
        setStartDate(date?.startOf('year').toISOString() ?? '')
        setEndDate(date?.endOf('year').toISOString() ?? '')
        break
      default:
        setStartDate(date?.startOf('week').add(7, 'hours').toISOString() ?? '')
        setEndDate(date?.endOf('week').add(7, 'hours').toISOString() ?? '')
        break
    }
  }

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
    refetch()
      .then(() => {
        if (!applicationData) {
          setChartData([])
          return
        }
        const groupedData = groupData(applicationData, displayMode, selectedDate)
        setChartData(groupedData)
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }, [applicationData, displayMode, refetch, selectedDate])

  // Calculate totalReceived and totalReturned
  const totalReceived = applicationData?.reduce((acc, item) => acc + item.totalReceived, 0) ?? 0
  const totalReturned = applicationData?.reduce((acc, item) => acc + item.totalReturned, 0) ?? 0

  return (
    <Card className={`p-4 shadow-md rounded-lg ${className}`}>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-semibold'>{t('DASHBOARD.APPLICATION_CHART.TITLE')}</h2>
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

      <div className='flex justify-start mb-4 ml-10'>
        <div className='pr-4'>
          <h3 className='text-2xl font-bold pr-3 text-center'>{totalReceived}</h3>
          <p className='text-gray-500 text-center'>{t('DASHBOARD.APPLICATION_CHART.RECEIVE')}</p>
        </div>
        <div>
          <h3 className='text-2xl font-bold text-center'>{totalReturned}</h3>
          <p className='text-gray-500 text-center'>{t('DASHBOARD.APPLICATION_CHART.RETURN')}</p>
        </div>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='label' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='received' fill='#4C9FF0' name={t('DASHBOARD.APPLICATION_CHART.RECEIVE')} />
          <Bar dataKey='returned' fill='#34D399' name={t('DASHBOARD.APPLICATION_CHART.RETURN')} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default ApplicationChart
