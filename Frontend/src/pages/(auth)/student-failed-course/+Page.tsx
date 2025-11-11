import { FC, Fragment, ReactNode, useState } from 'react'
import clockIcon from '#assets/icon/clockIcon.svg'
import { useTranslation } from 'react-i18next'
import { Select } from 'antd'
import { Semester } from '#src/types/Data/Semester.js'
import TableStudentFailedCourse from '#components/features/StudentFailedCourse/TableStudentFailedCourse.js'
import DetailStudentFailedCourse from '#components/features/StudentFailedCourse/DetailStudentFailedCourse.js'
import ExcelStudentFailedCourse from '#components/features/StudentFailedCourse/ExcelStudentFailedCourse.js'
import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import { useLastUpdatedData } from '#hooks/api/studentFailed/useStudentFailedCourseData.js'
import { convertToLocalDate } from '#utils/helper/convertToCurrentTime.js'
import EmailStudentFailed from '#components/features/StudentFailedCourse/EmailStudentFailed.js'
import { FailReason } from '#src/types/Enums/FailReason.js'

export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const [semesterName, setSemesterName] = useState<string | undefined>(undefined)
  const [failReason, setFailReason] = useState<FailReason | undefined>(undefined)

  const { data: semesterData } = useSemesterData()
  // const { data: currentSemester } = useCurrentSemesterData()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'detail' | null>(null)
  const [studentCode, setStudentCode] = useState<string>('')
  const { data } = useLastUpdatedData()

  const showModal = (Id: string, studentCode: string, type: 'detail'): void => {
    setIsModalVisible(true)
    setModalType(type)
    setStudentCode(studentCode) // Set the userId which triggers the query
  }

  const handleCloseModal = (): void => {
    setStudentCode('')
    setModalType(null)
    setIsModalVisible(false)
  }

  return (
    <Fragment>
      <header className='flex gap-1 items-center self-start text-sm leading-6'>
        <img
          loading='lazy'
          src={clockIcon}
          alt=''
          className='object-contain shrink-0 self-stretch my-auto w-6 aspect-square'
        />
        <span className='self-stretch my-auto font-medium'>{t('STUDENTS.SCAN_HISTORY')}:</span>
        <span className='self-stretch my-auto font-semibold'>{convertToLocalDate(data ?? '')}</span>
      </header>

      <div className='flex w-full rounded-sm min-h-[1px]'>
        <section className='flex flex-col lg:flex-row gap-4 justify-between items-start mt-6 w-full text-sm leading-6'>
          {/* Search and Filters Container */}
          <div className='flex-1 w-full lg:min-w-[400px]'>
            <div className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-center'>
              {/* Search Input */}
              <div className='w-full sm:w-[500px]'>
                <InputDebounce
                  value={searchTermDelayed}
                  onDebouncedChange={setSearchTermDelayed}
                  placeholder={t('DEFERS.SEARCH_TERM')}
                  variant='filled'
                  className='h-10 w-full'
                  prefix={<GlassIcon />}
                />
              </div>

              {/* Semester Select */}
              <div className='w-full sm:w-[200px]'>
                <Select
                  variant='filled'
                  className='h-10 w-full'
                  value={semesterName}
                  onChange={(e: string) => setSemesterName(e)}
                  placeholder={t('STUDENT_FAILED_COURSE.SEMESTER_SELECT_PLACEHOLDER')}
                >
                  <Select.Option key='all' value=''>
                    {t('STUDENT_FAILED_COURSE.ALL')}
                  </Select.Option>
                  {semesterData?.map((semester: Semester) => (
                    <Select.Option key={semester.id} value={semester.semesterName}>
                      {semester.semesterName}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Fail Reason Select */}
              <div className='w-full sm:w-[200px]'>
                <Select
                  variant='filled'
                  className='h-10 w-full'
                  value={failReason}
                  onChange={(value: FailReason) => setFailReason(value)}
                  placeholder={t('STUDENT_FAILED_COURSE.FAIL_REASON_SELECT_PLACEHOLDER')}
                >
                  <Select.Option key='all' value={undefined}>
                    {t('STUDENT_FAILED_COURSE.ALL')}
                  </Select.Option>
                  <Select.Option key={FailReason.AttendanceFail} value={FailReason.AttendanceFail}>
                    {t('STUDENT_FAILED_COURSE.TABLE_COLUMN.ATTENDANCE_FAIL')}
                  </Select.Option>
                  <Select.Option key={FailReason.Suspension} value={FailReason.Suspension}>
                    {t('STUDENT_FAILED_COURSE.TABLE_COLUMN.SUSPENDED')}
                  </Select.Option>
                  <Select.Option
                    key={FailReason.InsufficientPoints}
                    value={FailReason.InsufficientPoints}
                  >
                    {t('STUDENT_FAILED_COURSE.TABLE_COLUMN.MARK_FAIL')}
                  </Select.Option>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 items-center mt-4 lg:mt-0'>
            <ExcelStudentFailedCourse />
            <EmailStudentFailed />
          </div>
        </section>
      </div>
      <div className='mt-4'>
        <TableStudentFailedCourse
          searchTerm={searchTermDelayed}
          semesters={semesterName}
          failReason={failReason}
          showModal={showModal}
        />
      </div>
      {modalType === 'detail' && (
        <DetailStudentFailedCourse
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          staffDetails={studentCode}
        />
      )}
    </Fragment>
  )
}
