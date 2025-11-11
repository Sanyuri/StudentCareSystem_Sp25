import { Card, Typography } from 'antd'
import { t } from 'i18next'
import { FC, ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value: number
  change: number
  onTitleClick?: () => void
}

const { Title, Text } = Typography

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  value,
  change,
  onTitleClick,
}: DashboardCardProps): ReactNode => {
  return (
    <Card className='shadow'>
      <Text className='text-gray-500 cursor-pointer' onClick={onTitleClick}>
        {title}
      </Text>
      <Title level={4}>{value}</Title>
      <Text className={change > 0 ? 'text-green-500' : 'text-red-500'}>
        {change > 0 ? '+' : ''}
        {change}% {t('DASHBOARD.DASHBOARD_CARD.CHANGE')}
      </Text>
    </Card>
  )
}

export default DashboardCard
