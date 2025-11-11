import TableAttendance from '#components/features/Attendance/TableAttendance.js'
import { Button } from 'antd'
import { useState, FC, ReactNode, Fragment } from 'react'
import clockIcon from '#assets/icon/clockIcon.svg'
import { AttendanceFilter } from '#src/types/RequestModel/AttendanceRequest.js'
import { useTranslation } from 'react-i18next'
import AttendanceFilterComponent from '#components/features/Attendance/AttendanceFilter.js'
import FilterIcon from '#assets/icon/Filter.svg?react'
import ExcelAttendance from '#components/features/Attendance/ExcelAttendance.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import { useLastUpdatedData } from '#hooks/api/attendance/useAttendanceData.js'
import { convertToLocalDate } from '#utils/helper/convertToCurrentTime.js'

export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()

  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<AttendanceFilter>({})
  const { data: createdAt } = useLastUpdatedData()

  const showDrawer = (): void => {
    setOpen(true)
  }

  const onClose = (): void => {
    setOpen(false)
  }

  const handleFilterChange = (updatedFilter: AttendanceFilter): void => {
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
        <span className='self-stretch my-auto font-medium'>{t('ATTENDANCES.SCAN_HISTORY')}:</span>
        <span className='self-stretch my-auto font-semibold'>
          {convertToLocalDate(createdAt ?? '')}
        </span>
      </header>
      <div className='flex mt-1 w-full rounded-sm  min-h-[1px] max-md:max-w-full' />
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
        <div className='flex flex-wrap gap-3 items-center min-w-[240px] max-md:max-w-full'>
          <div className='flex gap-2 items-center self-stretch '>
            <Button
              color='primary'
              variant='outlined'
              size='large'
              icon={<FilterIcon />}
              onClick={() => showDrawer()}
            >
              <span className='font-semibold'>{t('COMMON.FILTER')}</span>
            </Button>
            <AttendanceFilterComponent
              open={open}
              onClose={onClose}
              onFilterChange={handleFilterChange}
            />
          </div>
          <ExcelAttendance />
          {/* <SendMultiMailAttendance /> */}
        </div>
      </section>
      <div className='mt-4'>
        <TableAttendance searchTerm={searchTermDelayed} filter={filter} />
      </div>
    </Fragment>
  )
}
