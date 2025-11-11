import { FC, useMemo } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Card } from 'antd'
import { useDashboardStudentCaredData } from '#hooks/api/dashboard/useDashboardData.js'
import { t } from 'i18next'

interface ClassNameProps {
  className?: string
}

const COLORS = ['#4CAF50', '#E0E0E0', '#FF9800', '#2196F3']

const StudentProgressChart: FC<ClassNameProps> = ({ className }) => {
  const { data: studentCaredData } = useDashboardStudentCaredData()

  const progressData = useMemo(
    () => [
      {
        name: t('DASHBOARD.STUDENT_NEED_CARE.STUDENT_CARED'),
        value: studentCaredData?.totalStudentCared ?? 0,
      },
      {
        name: t('DASHBOARD.STUDENT_NEED_CARE.STUDENT_DOING'),
        value: studentCaredData?.totalStudentDoing ?? 0,
      },
      {
        name: t('DASHBOARD.STUDENT_NEED_CARE.STUDENT_NOT_ASSIGNED'),
        value: studentCaredData?.totalStudentNotAssigned ?? 0,
      },
      {
        name: t('DASHBOARD.STUDENT_NEED_CARE.STUDENT_TODO'),
        value: studentCaredData?.totalStudentTodo ?? 0,
      },
    ],
    [studentCaredData],
  )

  const progressRate = studentCaredData?.previousPeriodDifferenceRate ?? 0
  const totalCared = studentCaredData?.totalStudentCared ?? 0
  const totalNeedCare = studentCaredData?.totalStudentNeedCare ?? 0

  return (
    <Card className={`p-4 rounded-lg shadow-md ${className}`}>
      <h2 className='text-lg font-semibold mb-4'>{t('DASHBOARD.STUDENT_NEED_CARE.TITLE')}</h2>

      <div className='flex justify-between items-center mb-6'>
        <div>
          <h3 className='text-2xl font-bold'>
            {totalCared}/{totalNeedCare}
          </h3>
          <p className='text-gray-500'>
            <span className={progressRate >= 0 ? 'text-green-500' : 'text-red-500'}>
              {progressRate >= 0 ? '+' : ''}
              {progressRate}%
            </span>{' '}
            {t('DASHBOARD.DASHBOARD_CARD.CHANGE')}
          </p>
        </div>
      </div>

      <ResponsiveContainer width='100%' height={200}>
        <PieChart>
          <Pie
            data={progressData}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
          >
            {progressData.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className='grid grid-cols-1 gap-2 mt-4 sm:grid-cols-2'>
        {progressData.map((item, index) => (
          <div key={item.name} className='flex items-center'>
            <span
              className='w-3.5 h-3.5 mr-2 rounded-full'
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <p className='text-sm text-gray-600'>{item.name}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default StudentProgressChart
