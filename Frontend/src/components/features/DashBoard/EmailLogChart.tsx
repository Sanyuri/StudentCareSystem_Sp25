import { useDashboardEmailLogsByTime } from '#hooks/api/dashboard/useDashboardData.js'
import { DashboardEmailLogsByTimeResponse } from '#src/types/ResponseModel/DashboardResponse.js'
import { Card, DatePicker, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { t } from 'i18next'
import { FC, ReactNode, useEffect, useState } from 'react'
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

interface ChartData {
  label: string
  pending: number
  sent: number
  failed: number
}

const { Option } = Select

const mode = ['week', 'month', 'year']

const groupData = (
  data: DashboardEmailLogsByTimeResponse[],
  displayMode: string,
  selectedDate: Dayjs | null,
): ChartData[] => {
  const map: Record<string, { pending: number; sent: number; failed: number }> = {}

  let labels: string[] = []
  if (displayMode === mode[0]) {
    labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  } else if (displayMode === mode[1]) {
    const daysInMonth = selectedDate ? selectedDate.daysInMonth() : 0
    labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())
  } else if (displayMode === mode[2]) {
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
      map[label] = { pending: 0, sent: 0, failed: 0 }
    }

    // Group theo EmailState
    switch (item.emailState) {
      case 'pending':
        map[label].pending += item.totalEmail
        break
      case 'sent':
        map[label].sent += item.totalEmail
        break
      case 'failed':
        map[label].failed += item.totalEmail
        break
      default:
        break
    }
  })

  return labels.map((label) => ({
    label,
    pending: map[label]?.pending ?? 0,
    sent: map[label]?.sent ?? 0,
    failed: map[label]?.failed ?? 0,
  }))
}

const EmailLogChart: FC<ClassNameProps> = ({ className }: ClassNameProps): ReactNode => {
  const [displayMode, setDisplayMode] = useState<string>(mode[0])
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [totalEmails, setTotalEmails] = useState<number>(0)
  const [totalEmailsSent, setTotalEmailsSent] = useState<number>(0)

  const [startDate, setStartDate] = useState<string>(
    dayjs().startOf('week').add(7, 'hours').toISOString(),
  )
  const [endDate, setEndDate] = useState<string>(
    dayjs().endOf('week').add(7, 'hours').toISOString(),
  )

  const { data: emailLogsData, refetch } = useDashboardEmailLogsByTime(startDate, endDate)

  const handleDisplayModeChange = (value: string) => {
    setDisplayMode(value)
    handleStartDateEndDate(selectedDate, value)
  }

  const handleDateChange = (date: Dayjs) => {
    setSelectedDate(date)
    handleStartDateEndDate(date, displayMode)
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

  const handleStartDateEndDate = (date: Dayjs | null, displayMode: string) => {
    if (!date) return
    switch (displayMode) {
      case mode[1]:
        setStartDate(date.startOf('month').add(7, 'hours').toISOString())
        setEndDate(date.endOf('month').add(7, 'hours').toISOString())
        break
      case mode[2]:
        setStartDate(date.startOf('year').toISOString())
        setEndDate(date.endOf('year').toISOString())
        break
      default:
        setStartDate(date.startOf('week').add(7, 'hours').toISOString())
        setEndDate(date.endOf('week').add(7, 'hours').toISOString())
        break
    }
  }

  useEffect(() => {
    refetch()
      .then(() => {
        if (!emailLogsData) {
          setChartData([])
          setTotalEmails(0)
          setTotalEmailsSent(0)
          return
        }
        const groupedData = groupData(emailLogsData, displayMode, selectedDate)
        setChartData(groupedData)

        const total = groupedData.reduce(
          (total, item) => total + item.pending + item.sent + item.failed,
          0,
        )
        const sent = groupedData.reduce((total, item) => total + item.sent, 0)
        setTotalEmails(total)
        setTotalEmailsSent(sent)
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }, [emailLogsData, displayMode, refetch, selectedDate])

  return (
    <Card className={`p-4 rounded-lg shadow-md ${className ?? ''}`}>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>{t('DASHBOARD.EMAIL_LOG_CHART.TITLE')}</h2>
        <Select defaultValue={mode[0]} onChange={handleDisplayModeChange} style={{ width: 200 }}>
          {mode.map((m) => (
            <Option key={m} value={m}>
              {t(`DASHBOARD.EMAIL_LOG_CHART.${m.toUpperCase()}.TITLE`)}
            </Option>
          ))}
        </Select>

        {mode.map((m) => (
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
          <h3 className='text-2xl font-bold pr-3 text-center'>{totalEmailsSent}</h3>
          <p className='text-gray-500 text-center'>
            {t('DASHBOARD.EMAIL_LOG_CHART.TOTAL_EMAIL_SENT')}
          </p>
        </div>
        <div>
          <h3 className='text-2xl font-bold text-center'>
            {totalEmails ? ((totalEmailsSent / totalEmails) * 100).toFixed(2) : '0'}%
          </h3>
          <p className='text-gray-500 text-center'>
            {t('DASHBOARD.EMAIL_LOG_CHART.TOTAL_EMAIL_SENT_PROCESS')}
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
            dataKey='pending'
            stackId='a'
            fill='#FACC15'
            name={t('DASHBOARD.EMAIL_LOG_CHART.PENDING')}
          />
          <Bar
            dataKey='sent'
            stackId='a'
            fill='#4CAF50'
            name={t('DASHBOARD.EMAIL_LOG_CHART.SENT')}
          />
          <Bar
            dataKey='failed'
            stackId='a'
            fill='#EF4444'
            name={t('DASHBOARD.EMAIL_LOG_CHART.FAILED')}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default EmailLogChart
