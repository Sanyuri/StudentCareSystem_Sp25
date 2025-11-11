import dayjs, { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import { semesters } from '#utils/constants/semestersList.js'
import { AttendanceFilter } from '#src/types/RequestModel/AttendanceRequest.js'
import { Button, Col, DatePicker, Drawer, Input, InputNumber, Row, Select } from 'antd'

interface AttendanceFilterProps {
  open: boolean

  onClose(): void

  onFilterChange: (updatedFilter: AttendanceFilter) => void
}

const AttendanceFilterComponent: FC<AttendanceFilterProps> = ({
  open,
  onClose,
  onFilterChange,
}: AttendanceFilterProps): ReactNode => {
  const { RangePicker } = DatePicker
  const { t } = useTranslation()
  const [customDateRange, setCustomDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [filterState, setFilterState] = useState<AttendanceFilter>({
    minAbsenceRate: undefined,
    maxAbsenceRate: undefined,
    subjectCode: undefined,
    className: undefined,
    totalAbsences: undefined,
    currentTermNo: undefined,
    major: undefined,
    from: undefined,
    to: undefined,
    totalSlots: undefined,
    isIncreased: undefined,
  })

  const handleChange = (key: keyof AttendanceFilter, value: unknown): void => {
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null): void => {
    setCustomDateRange(dates)
    handleChange('from', dates?.[0]?.toDate())
    handleChange('to', dates?.[1]?.toDate())
  }

  const handleFilterSubmit = (): void => {
    onFilterChange(filterState)
  }

  const handleReset = (): void => {
    // Reset to the initial state
    const resetState: AttendanceFilter = {
      minAbsenceRate: undefined,
      maxAbsenceRate: undefined,
      subjectCode: undefined,
      className: undefined,
      totalAbsences: undefined,
      currentTermNo: undefined,
      major: undefined,
      from: undefined,
      to: undefined,
      totalSlots: undefined,
      isIncreased: undefined,
    }

    setFilterState(resetState) // Reset the filter state
    setCustomDateRange(null) // Clear the custom date range
    onFilterChange(resetState) // Call the parent function with the reset state
  }

  const absenceTrend: { value: boolean; label: string }[] = [
    {
      value: true,
      label: t('ATTENDANCES.FILTER.INCREASE'),
    },
    {
      value: false,
      label: t('ATTENDANCES.FILTER.DECREASE'),
    },
  ]
  return (
    <Drawer title={t('COMMON.FILTER')} placement='right' onClose={onClose} open={open} width={400}>
      <div className='space-y-4'>
        <div>
          <label className='block mb-1 text-sm font-medium'>
            {t('ATTENDANCES.FILTER.ABSENT_RATE')}
          </label>
          <Row gutter={8} align='middle' className='justify-center'>
            <Col span={11}>
              <InputNumber
                className='w-full'
                placeholder={t('ATTENDANCES.FILTER.ABSENT_MIN_RATE')}
                value={filterState.minAbsenceRate ?? undefined} // Use undefined for empty value
                onChange={
                  (value: number | null): void =>
                    handleChange('minAbsenceRate', value !== undefined ? value : undefined) // Check if value is undefined
                }
              />
            </Col>
            <Col span={2} className='text-center'>
              {t('COMMON.TO')}
            </Col>
            <Col span={11}>
              <InputNumber
                className='w-full'
                placeholder={t('ATTENDANCES.FILTER.ABSENT_MAX_RATE')}
                value={filterState.maxAbsenceRate ?? undefined} // Use undefined for empty value
                onChange={
                  (
                    value: number | null, // Use 'value' directly from InputNumber
                  ): void => handleChange('maxAbsenceRate', value !== undefined ? value : undefined) // Check if value is undefined
                }
              />
            </Col>
          </Row>
        </div>
        {/* Total slots filed */}
        <div>
          <label className='block mb-1 text-sm font-medium'>
            {t('ATTENDANCES.FILTER.TOTAL_SLOT')}
          </label>
          <Input
            placeholder={t('ATTENDANCES.FILTER.TOTAL_SLOT')}
            value={filterState.totalSlots ?? ''} // Use filterState instead of filter
            onChange={(e): void => handleChange('totalSlots', e.target.value)}
          />
        </div>
        {/* Check increase or decrease field */}
        <div>
          <label className='block mb-1 text-sm font-medium'>{t('ATTENDANCES.FILTER.TRENDS')}</label>
          <Select
            placeholder={t('ATTENDANCES.FILTER.TRENDS')}
            style={{ width: '100%' }}
            options={absenceTrend}
            onChange={(value: number): void => handleChange('isIncreased', value)}
          />
        </div>
        {/* Subject code field */}
        <div>
          <label className='block mb-1 text-sm font-medium'>
            {t('ATTENDANCES.FILTER.SUBJECT_CODE')}
          </label>
          <Input
            placeholder={t('ATTENDANCES.FILTER.SUBJECT_CODE')}
            value={filterState.subjectCode ?? ''} // Use filterState instead of filter
            onChange={(e): void => handleChange('subjectCode', e.target.value)}
          />
        </div>
        <div>
          <label className='block mb-1 text-sm font-medium'>{t('ATTENDANCES.FILTER.CLASS')}</label>
          <Input
            placeholder={t('COMMON.CLASS_HINT')}
            value={filterState.className ?? ''} // Use filterState instead of filter
            onChange={(e): void => handleChange('className', e.target.value)}
          />
        </div>
        <div>
          <label className='block mb-1 text-sm font-medium'>
            {t('ATTENDANCES.FILTER.TOTAL_ABSENT')}
          </label>
          <Input
            placeholder={t('ATTENDANCES.FILTER.TOTAL_ABSENT')}
            value={filterState.totalAbsences ?? ''} // Use filterState instead of filter
            onChange={(e): void =>
              handleChange('totalAbsences', parseInt(e.target.value) || undefined)
            }
          />
        </div>
        <div>
          <label className='block mb-1 text-sm font-medium'>
            {t('ATTENDANCES.FILTER.SEMESTER')}
          </label>
          <Select
            placeholder={t('ATTENDANCES.FILTER.SEMESTER_SEARCH')}
            style={{ width: '100%' }}
            options={semesters}
            value={filterState.currentTermNo} // Use filterState instead of filter
            onChange={(value: number): void => handleChange('currentTermNo', value)}
          />
        </div>
        <div>
          <label className='block mb-1 text-sm font-medium'>{t('ATTENDANCES.FILTER.MAJOR')}</label>
          <Input
            placeholder={t('ATTENDANCES.FILTER.MAJOR_HINT')}
            value={filterState.major ?? ''} // Use filterState instead of filter
            onChange={(e): void => handleChange('major', e.target.value)}
          />
        </div>
        <div>
          <label className='block mb-1 text-sm font-medium'>
            {t('ATTENDANCES.FILTER.DATE_RANGE')}
          </label>
          <RangePicker
            format='DD-MM-YYYY'
            style={{ width: '100%' }}
            onChange={handleDateRangeChange}
            value={customDateRange || [dayjs(filterState.from), dayjs(filterState.to)]}
          />
        </div>

        <Row justify='space-between' gutter={8}>
          <Col>
            <Button danger size='large' style={{ width: '120px' }} onClick={handleReset}>
              {t('COMMON.RESET_ACTION')}
            </Button>
          </Col>
          <Col>
            <Button
              type='primary'
              size='large'
              onClick={handleFilterSubmit}
              style={{ width: '120px' }}
            >
              {t('COMMON.FILTER_ACTION')}
            </Button>
          </Col>
        </Row>
      </div>
    </Drawer>
  )
}

export default AttendanceFilterComponent
