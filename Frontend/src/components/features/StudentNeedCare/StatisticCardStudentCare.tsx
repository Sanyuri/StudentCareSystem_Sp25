import React, { FC } from 'react'
import { Card } from 'antd'

interface StatisticCardStudentCareProps {
  icon: React.ReactNode
  title: string
  value: number
  style?: React.CSSProperties
}

const StatisticCardStudentCare: FC<StatisticCardStudentCareProps> = ({
  icon,
  title,
  value,
  style = {},
}: StatisticCardStudentCareProps) => (
  <Card
    variant={'borderless'}
    style={{
      borderRadius: '8px',
      ...style,
    }}
  >
    <div className='flex items-center gap-3'>
      {icon}
      <div>
        <div className='text-[28px] font-semibold leading-tight'>{value}</div>
        <div className='text-sm'>{title}</div>
      </div>
    </div>
  </Card>
)

export default StatisticCardStudentCare
