import { useAttendanceHistoryData } from '#hooks/api/attendanceRateBoundary/useAttendanceRateBoundaries.js'
import { convertToLocalDate, convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import { BarChartOutlined } from '@ant-design/icons'
import { Card, Modal } from 'antd'
import Text from 'antd/es/typography/Text'
import { t } from 'i18next'
import { useState } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface AbsenceChartProps {
  id: string
}

const AbsenceChart: React.FC<AbsenceChartProps> = ({ id }) => {
  const { data, refetch } = useAttendanceHistoryData(id)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  // Transform data for columns (Total Absences)
  const columnData =
    data?.map((item) => ({
      createdAt: item.createdAt,
      newTotal: item.newTotalAbsences,
      emailSent: item.isSendEmail,
    })) || []

  // Transform data for lines (Absence Rates)
  const lineData =
    data?.map((item) => ({
      createdAt: item.createdAt,
      newRate: item.newAbsenceRate,
    })) || []

  // Combine both column and line data into a single data structure
  const combinedData = columnData.map((colItem, index) => ({
    createdAt: colItem.createdAt,
    newTotal: colItem.newTotal,
    newRate: lineData[index]?.newRate,
    sentEmail: colItem.emailSent,
  }))

  // Handle show modal
  const handleShowModal = async () => {
    setIsModalVisible(true)
    await refetch()
  }

  return (
    <div>
      <BarChartOutlined onClick={handleShowModal} />

      <Modal
        title={t('ATTENDANCE_CHART.MODAL.TITLE')}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
      >
        <div style={{ height: 400, marginBottom: '24px' }}>
          {/* ComposedChart for both Bar and Line */}
          {data && data.length > 0 ? (
            <ResponsiveContainer width='100%' height={400}>
              <ComposedChart data={combinedData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='createdAt'
                  tickFormatter={(value) => convertToLocalDateTime(value)}
                />

                {/* YAxis cho Total Absences (slot) */}
                <YAxis
                  yAxisId='left'
                  label={{
                    value: t('ATTENDANCE_CHART.MODAL.TOTAL_ABSENCE'),
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />

                {/* YAxis cho Absence Rate (%) */}
                <YAxis
                  yAxisId='right'
                  orientation='right'
                  label={{
                    value: t('ATTENDANCE_CHART.MODAL.ABSENCE_RATE'),
                    angle: -90,
                    position: 'insideRight',
                  }}
                />
                <Tooltip
                  labelFormatter={(value) => convertToLocalDate(value)}
                  labelStyle={{ color: 'blue' }}
                />
                <Legend />
                <Bar
                  yAxisId='left'
                  dataKey='newTotal'
                  name='Total Absences'
                  fill='#ff7f0e'
                  barSize={20}
                >
                  {combinedData.map((entry) => (
                    <Cell key={entry.createdAt} fill={entry.sentEmail ? '#82ca9d' : '#ff7f0e'} />
                  ))}
                </Bar>
                <Bar
                  yAxisId='left'
                  dataKey='sentEmail'
                  name={t('ATTENDANCE_CHART.MODAL.CHART.EMAIL_SENT')}
                  fill='#82ca9d'
                  barSize={0}
                />
                <Line
                  yAxisId='right'
                  type='monotone'
                  dataKey='newRate'
                  stroke='#f50'
                  activeDot={{ r: 8 }}
                  name={t('ATTENDANCE_CHART.MODAL.ABSENCE_RATE')}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <Text>No data available</Text>
          )}
        </div>

        <div style={{ marginTop: '24px', overflowY: 'auto', height: '300px' }}>
          {data?.map((item) => (
            <Card key={item.id} style={{ marginTop: 16 }}>
              <Text strong>Created At: </Text>
              <Text>{convertToLocalDate(item.createdAt)}</Text>
              <br />
              <Text strong>Email Sent: </Text>
              <Text>{item.isSendEmail ? 'Yes' : 'No'}</Text>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default AbsenceChart
