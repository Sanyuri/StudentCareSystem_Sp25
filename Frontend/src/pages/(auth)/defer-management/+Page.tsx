import { useState, ReactNode, FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import clockIcon from '#assets/icon/clockIcon.svg'
import { Select } from 'antd'
import TableDefer from '#components/features/Defer/TableDefer.js'
import { Semester } from '#types/Data/Semester.js'
import ExcelStudentDefer from '#components/features/Defer/ExcelStudentDefer.js'
import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import EmailDefer from '#components/features/Defer/EmailDefer.js'
import { useLastUpdatedData } from '#hooks/api/defer/userDeferData.js'
import { convertToLocalDate } from '#utils/helper/convertToCurrentTime.js'

export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const { data } = useSemesterData()
  const [deferredSemesterName, setDeferredSemesterName] = useState<string | undefined>()
  const [searchTermDelayed, setSearchTermDelayed] = useState('')

  //const [filter, setFilter] = useState<AttendanceFilter>({})
  const { data: createdAt } = useLastUpdatedData()

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
        <span className='self-stretch my-auto font-semibold'>
          {convertToLocalDate(createdAt ?? '')}
        </span>
      </header>

      <div className='flex w-full rounded-sm  min-h-[1px] max-md:max-w-full'>
        <section className='flex flex-wrap gap-10 justify-between items-start mt-6 w-full text-sm leading-6 max-md:max-w-full'>
          <div className='min-w-[400px] max-md:max-w-full'>
            <div className='flex flex-wrap items-center space-x-4'>
              <div className='flex-1 min-w-[400px] mb-2 mr-2'>
                <InputDebounce
                  value={searchTermDelayed}
                  onDebouncedChange={setSearchTermDelayed}
                  placeholder={t('DEFERS.SEARCH_TERM')}
                  style={{ width: 500 }}
                  variant='filled'
                  className='h-10'
                  prefix={<GlassIcon />}
                />
              </div>

              {/* Select */}
              <div className='min-w-[200px] mb-2 ml-[-16px]'>
                <Select
                  variant='filled'
                  placeholder={t('DEFERS.SELECT_DEFERRED_SEMESTER')}
                  className='h-10 w-full max-w-[200px] ml-0'
                  value={deferredSemesterName}
                  onChange={(e: string): void => setDeferredSemesterName(e)}
                >
                  <Select.Option value=''>{t('DEFERS.ALL')}</Select.Option>
                  {data?.map(
                    (semester: Semester): ReactNode => (
                      <Select.Option key={semester.id} value={semester.semesterName}>
                        {semester.semesterName + (semester.isCurrentSemester ? ' (current)' : '')}
                      </Select.Option>
                    ),
                  )}
                </Select>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap gap-3 max-md:max-w-full'>
            <ExcelStudentDefer />
            <EmailDefer />
          </div>
        </section>
      </div>
      <div className='mt-4'>
        <TableDefer searchTerm={searchTermDelayed} semesters={deferredSemesterName} />
      </div>
    </Fragment>
  )
}
