import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DateTime } from 'luxon'
import DashboardCard from '#components/features/DashBoard/DashboardCard.js'
import StudentProgressChart from '#components/features/DashBoard/StudentProgressChart.js'
import ApplicationChart from '#components/features/DashBoard/ApplicationChart.js'
import ApplicationSummaryStats from '#components/features/DashBoard/ApplicationSummaryStats.js'
import AttendanceReminderModal from '#components/features/Statistics/AttendanceReminderModal.js'

import clockIcon from '#assets/icon/clockIcon.svg'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'

import {
  useDashboardAttendanceData,
  useDashboardDefermentData,
  useDashboardFailedCourseData,
  useDashboardTotalReminderData,
} from '#hooks/api/dashboard/useDashboardData.js'
import EmailLogChart from '#components/features/DashBoard/EmailLogChart.js'

const Page = () => {
  const { t } = useTranslation()

  const { data: totalReminderData } = useDashboardTotalReminderData()
  const { data: attendanceData } = useDashboardAttendanceData()
  const { data: defermentData } = useDashboardDefermentData()
  const { data: failedCourseData } = useDashboardFailedCourseData()

  const initialStats = [
    { title: t('DASHBOARD.STATISTICS.TOTAL_REMINDER'), value: 0, change: 0, type: null },
    {
      title: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.TITLE'),
      value: 0,
      change: 0,
      type: 'attendanceNotification',
    },
    {
      title: t('DASHBOARD.STATISTICS.DEFER_REMINDER'),
      value: 0,
      change: 0,
      type: 'deferNotification',
    },
    {
      title: t('DASHBOARD.STATISTICS.HIGH_RISK_STUDENTS'),
      value: 0,
      change: 0,
      type: 'failedSubjectNotification',
    },
  ]

  const [stats, setStats] = useState(initialStats)
  const [modalIndex, setModalIndex] = useState<number | null>(null)

  useEffect(() => {
    try {
      setStats([
        {
          title: t('DASHBOARD.STATISTICS.TOTAL_REMINDER'),
          value: totalReminderData?.totalReminds ?? 0,
          change: totalReminderData?.previousPeriodDifferenceRate ?? 0,
          type: null,
        },
        {
          title: t('DASHBOARD.STATISTICS.ATTENDANCE_REMINDER.TITLE'),
          value: attendanceData?.totalReminds ?? 0,
          change: attendanceData?.previousPeriodDifferenceRate ?? 0,
          type: 'attendanceNotification',
        },
        {
          title: t('DASHBOARD.STATISTICS.DEFER_REMINDER'),
          value: defermentData?.totalReminds ?? 0,
          change: defermentData?.previousPeriodDifferenceRate ?? 0,
          type: 'deferNotification',
        },
        {
          title: t('DASHBOARD.STATISTICS.HIGH_RISK_STUDENTS'),
          value: failedCourseData?.totalReminds ?? 0,
          change: failedCourseData?.previousPeriodDifferenceRate ?? 0,
          type: 'failSubjectNotification',
        },
      ])
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred')
      }
    }
  }, [t, totalReminderData, attendanceData, defermentData, failedCourseData])

  const showModal = useCallback((index: number) => setModalIndex(index), [])
  const closeModal = useCallback(() => setModalIndex(null), [])

  return (
    <div className='p-6'>
      <header className='flex gap-1 items-center text-sm leading-6 mb-2'>
        <img src={clockIcon} alt='' className='w-6 aspect-square' />
        <span className='font-medium'>{t('DASHBOARD.STATISTICS.LAST_UPDATED')}:</span>
        <span className='font-semibold'>{convertToLocalDateTime(DateTime.now().toString())}</span>
      </header>

      {/* Stats */}
      <div className='grid grid-cols-4 gap-4 mb-4'>
        {stats.map((stat, index) => (
          <DashboardCard
            key={stat.type}
            title={stat.title}
            value={stat.value ?? 0}
            change={stat.change ?? 0}
            onTitleClick={() => showModal(index)}
          />
        ))}
      </div>

      {/* Render modal khi cần */}
      {modalIndex !== null && (
        <AttendanceReminderModal
          key={stats[modalIndex].type}
          title={stats[modalIndex].title}
          type={stats[modalIndex].type}
          isVisible={modalIndex !== null}
          onClose={closeModal}
        />
      )}

      <div className='grid grid-cols-4 gap-4 mb-4'>
        <EmailLogChart className='col-span-3' />
        <StudentProgressChart className='col-span-1' />
      </div>
      <div className='grid grid-cols-4 gap-4 mb-4'>
        <ApplicationChart className='col-span-3' />
        <ApplicationSummaryStats className='col-span-1' />
      </div>
    </div>
  )
}

export default Page
