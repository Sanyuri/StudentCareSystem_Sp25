import { Button } from 'antd'
import { FC, Fragment, ReactNode, useState } from 'react'
import clockIcon from '#assets/icon/clockIcon.svg'
import { AttendanceFilter } from '#src/types/RequestModel/AttendanceRequest.js'
import { useTranslation } from 'react-i18next'
import { StudentFilter } from '#types/RequestModel/AttendanceRequest.js'
import StudentFilterComponent from '#components/features/StudentManagement/StudentFilter.js'
import TableStudent from '#components/features/StudentManagement/TableStudent.js'
import SanitizedHTML from '#components/common/SanitizedHTML.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import FilterIcon from '#assets/icon/Filter.svg?react'
export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<AttendanceFilter>({})
  const [lastUpdate, setLastUpdate] = useState(t('COMMON.LOADING'))

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const handleFilterChange = (updatedFilter: StudentFilter) => {
    setFilter(updatedFilter)
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
        <span className='self-stretch my-auto font-semibold'>
          <SanitizedHTML htmlContent={lastUpdate} />
        </span>
      </header>
      <section className='flex flex-wrap gap-10 justify-between items-start mt-6 w-full text-sm leading-6 max-md:max-w-full'>
        <div className='min-w-[400px] max-md:max-w-full'>
          <InputDebounce
            value={searchTermDelayed}
            onDebouncedChange={setSearchTermDelayed}
            placeholder={t('ATTENDANCES.STUDENT_SEARCH_TERM')}
            style={{ width: 500 }}
            variant='filled'
            className='h-10'
            prefix={<GlassIcon />}
          />
        </div>
        <div className='flex flex-wrap gap-3 items-center max-md:max-w-full'>
          {/*<div className='flex gap-2 items-center self-stretch '>*/}
          <Button
            color='primary'
            variant='outlined'
            size='large'
            icon={<FilterIcon />}
            onClick={() => showDrawer()}
          >
            <span className='font-semibold'>{t('COMMON.FILTER')}</span>
          </Button>
          <StudentFilterComponent
            open={open}
            onClose={onClose}
            onFilterChange={handleFilterChange}
          />
          {/*</div>*/}

          {/* <SendMultiMailAttendance /> */}
        </div>
      </section>
      <div className='mt-4'>
        <TableStudent
          searchTerm={searchTermDelayed}
          filter={filter}
          setLastUpdate={setLastUpdate}
        />
      </div>
    </Fragment>
  )
}
