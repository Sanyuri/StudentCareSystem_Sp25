import { useDashboardTotalApplicationsData } from '#hooks/api/dashboard/useDashboardData.js'
import { Card } from 'antd'
import { t } from 'i18next'
import { FC, ReactNode } from 'react'
interface ClassNameProps {
  className?: string
}

const ApplicationSummaryStats: FC<ClassNameProps> = ({ className }: ClassNameProps): ReactNode => {
  const { data: totalApplicationData } = useDashboardTotalApplicationsData()
  return (
    <Card className={`p-4 shadow-md rounded-lg ${className}`}>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-semibold'>{t('DASHBOARD.APPLICATION_SUMMARY.TITLE')}</h2>
      </div>

      <div className='flex justify-between mb-4'>
        <div>
          <h3 className='text-2xl font-bold text-blue-500 text-center'>
            {totalApplicationData?.totalReceivedApplication}
          </h3>
          <p className='text-gray-500 text-center'>{t('DASHBOARD.APPLICATION_SUMMARY.RECEIVE')}</p>
        </div>
        <div>
          <h3 className='text-2xl font-bold text-green-500 text-center'>
            {totalApplicationData?.totalReturnedApplication}
          </h3>
          <p className='text-gray-500 text-center'>{t('DASHBOARD.APPLICATION_SUMMARY.RETURN')}</p>
        </div>
      </div>
      <div className='overflow-y-auto max-h-[300px]'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead>
            <tr className='text-gray-700 border-b'>
              <th className='py-2 px-3'>#</th>
              <th className='py-2 px-3'>{t('DASHBOARD.APPLICATION_SUMMARY.TYPE')}</th>
              <th className='py-2 px-3 text-right'>{t('DASHBOARD.APPLICATION_SUMMARY.TOTAL')}</th>
            </tr>
          </thead>
          <tbody>
            {totalApplicationData?.applicationTypes.map((applicationType, index) => (
              <tr key={applicationType.id} className='border-b hover:bg-gray-100'>
                <td className='py-2 px-3'>{index + 1}</td>
                <td className='py-2 px-3'>{applicationType.vietnameseName}</td>
                <td className='py-2 px-3 text-right'>{applicationType.totalApplications}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default ApplicationSummaryStats
