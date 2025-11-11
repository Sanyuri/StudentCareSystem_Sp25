import TableActivity from '#components/features/Activity/TableActivity.js'
import { Select, DatePicker, Modal, Button } from 'antd'
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import { FilterTime, FilterActivity } from '#src/types/RequestModel/ActivityRequest.js'
import { useActivityOptions } from '#utils/constants/Activity/index.js'
import { useTranslation } from 'react-i18next'
import { convertToDateOption } from '#utils/helper/convertToDateOption.js'
import dayjs, { Dayjs } from 'dayjs'
import InputDebounce from '#components/common/input/InputDebounce.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'

const { RangePicker } = DatePicker

export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()

  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const [activityType, setActivityType] = useState<FilterActivity>('')
  const [filterTime, setFilterTime] = useState<FilterTime>('today')
  const { activityFilterTableOptions, activityDateTableOptions } = useActivityOptions()

  const [dateRange, setDateRange] = useState({ fromDate: new Date(), toDate: new Date() })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [customDateRange, setCustomDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)

  useEffect(() => {
    if (filterTime !== 'date-range') {
      const { fromDate = new Date(), toDate = new Date() } = convertToDateOption(filterTime)
      setDateRange({ fromDate, toDate })
    } else {
      setIsModalVisible(true) // Show the modal when 'date-range' is selected
    }
  }, [filterTime])

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setCustomDateRange(dates)
  }

  const handleOk = (): void => {
    if (customDateRange?.[0] && customDateRange?.[1]) {
      setDateRange({
        fromDate: customDateRange[0].toDate(),
        toDate: customDateRange[1].toDate(),
      })
    }
    setIsModalVisible(false)
  }

  const handleCancel = (): void => {
    setIsModalVisible(false)
  }

  return (
    <Fragment>
      <section className='flex flex-wrap gap-10 justify-between items-start w-full text-sm leading-6 max-md:max-w-full'>
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
          <div className='flex gap-2 items-center self-stretch my-auto min-w-[240px] w-[350px]'>
            <label
              htmlFor='activityFilter'
              className='flex items-center self-stretch my-auto font-medium'
            >
              {t('COMMON.ACTION_DATE')}:
            </label>
            <Select
              defaultValue='today'
              size='large'
              style={{ width: 200 }}
              options={activityDateTableOptions}
              value={filterTime}
              onChange={setFilterTime}
            />
          </div>

          <div className='flex gap-2 items-center self-stretch my-auto min-w-[240px] w-[304px]'>
            <label
              htmlFor='activityFilter'
              className='flex items-center self-stretch my-auto font-medium'
            >
              {t('COMMON.ACTION')}:
            </label>
            <Select
              defaultValue=''
              size='large'
              style={{ width: 200 }}
              options={activityFilterTableOptions}
              value={activityType}
              onChange={setActivityType}
            />
          </div>
        </div>
      </section>

      {/* Modal for Custom Date Range */}
      <Modal
        title={t('COMMON.SELECT_DATE_RANGE')}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleCancel}>
            {t('COMMON.CANCEL')}
          </Button>,
          <Button key='submit' type='primary' onClick={handleOk}>
            {t('COMMON.CONFIRM')}
          </Button>,
        ]}
      >
        <RangePicker
          onChange={handleDateRangeChange}
          defaultValue={customDateRange ?? [dayjs(dateRange.fromDate), dayjs(dateRange.toDate)]}
        />
      </Modal>

      <div className='mt-4'>
        <TableActivity
          searchTerm={searchTermDelayed}
          activityType={activityType}
          fromDate={dateRange.fromDate}
          toDate={dateRange.toDate}
        />
      </div>
    </Fragment>
  )
}
