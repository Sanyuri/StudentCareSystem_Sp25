import { Modal } from 'antd'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import TableDetailStudentFailedCourse from './TableDetailStudentFailedCourse.js'
import {
  useStudentFailedCourseDetail,
  useStudentInfo,
} from '#hooks/api/studentFailed/useStudentFailedCourseData.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  staffDetails: string
}

const DetailStudentFailedCourse: FC<StaffModalProps> = ({
  isVisible,
  onClose,
  staffDetails,
}: Readonly<StaffModalProps>): ReactNode => {
  const { t } = useTranslation()
  const { data: student } = useStudentInfo(staffDetails)
  const { data: studentFailedCourse, isLoading } = useStudentFailedCourseDetail(staffDetails)

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
      title={<div className='text-lg font-bold h1'>{t('STUDENT_FAILED_COURSE.DETAIL.TITLE')}</div>}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className='p-4 space-y-4'>
          <div className='grid grid-cols-2 gap-y-4 gap-x-8'>
            <div className='flex items-center'>
              <p className='text-xs font-medium mx-2'>
                {t(`STUDENT_FAILED_COURSE.TABLE_COLUMN.STUDENT_CODE`)}:
              </p>
              <p className='text-sm font-medium'>{student?.studentCode}</p>
            </div>
            <div className='flex items-center'>
              <p className='text-xs font-medium mx-2'>
                {t(`STUDENT_FAILED_COURSE.TABLE_COLUMN.STUDENT_NAME`)}:
              </p>
              <p className='text-sm font-medium'>{student?.studentName}</p>
            </div>
            <div className='flex items-center'>
              <p className='text-xs font-medium mx-2'>
                {t(`STUDENT_FAILED_COURSE.TABLE_COLUMN.EMAIL`)}:
              </p>
              <p className='text-sm font-medium'>{student?.email}</p>
            </div>
            <div className='flex items-center'>
              <p className='text-xs font-medium mx-2'>
                {t(`STUDENT_FAILED_COURSE.TABLE_COLUMN.PHONE`)}:
              </p>
              <p className='text-sm font-medium'>{student?.mobilePhone}</p>
            </div>
            <div className='flex items-center'>
              <p className='text-xs font-medium mx-2'>
                {t(`STUDENT_FAILED_COURSE.TABLE_COLUMN.SPECIALIZATION`)}:
              </p>
              <p className='text-sm font-medium'>{student?.specialization}</p>
            </div>
            <div className='flex items-center'>
              <p className='text-xs font-medium mx-2'>
                {t(`STUDENT_FAILED_COURSE.TABLE_COLUMN.MAJOR`)}:
              </p>
              <p className='text-sm font-medium'>{student?.major}</p>
            </div>
          </div>

          <div className='p-3 rounded-md flex items-center'>
            {studentFailedCourse && (
              <TableDetailStudentFailedCourse
                dataSource={Array.isArray(studentFailedCourse) ? studentFailedCourse : []}
                loading={isLoading}
                scroll={{ y: 200 }}
              />
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

export default DetailStudentFailedCourse
