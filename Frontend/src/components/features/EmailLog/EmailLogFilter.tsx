import { EmailState } from '#src/types/Enums/EmailState.js'
import { EmailType } from '#src/types/Enums/EmailType.js'
import { EmailLogRequest } from '#src/types/RequestModel/EmailLogRequest.js'
import { DatePicker, Select, Button, Drawer, Input } from 'antd'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select

export const EmailLogFilter: FC<{
  filter: EmailLogRequest
  open: boolean
  onClose: () => void
  onFilterChange: (newFilter: EmailLogRequest) => void
}> = ({ filter, open, onClose, onFilterChange }) => {
  const { t } = useTranslation()

  const [tempFilter, setTempFilter] = useState<EmailLogRequest>(filter)
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)

  const handleReset = () => {
    setTempFilter({
      ...filter,
      emailState: '',
      emailType: '',
      minCreatedDate: undefined,
      maxCreatedDate: undefined,
      pageNumber: 1,
      pageSize: filter.pageSize,
      semesterName: '',
    })
    setDateRange(null) // Reset RangePicker
  }

  const handleSubmit = () => {
    onFilterChange(tempFilter)
    onClose()
  }

  return (
    <Drawer title='Bộ lọc Email Log' placement='right' onClose={onClose} open={open} width={400}>
      <div className='flex flex-col gap-4'>
        <label className='font-medium'>{t('EMAIL_LOG.LABEL.EMAIL_STATE')}</label>
        <Select
          value={tempFilter.emailState}
          onChange={(value) => setTempFilter({ ...tempFilter, emailState: value })}
          placeholder='Trạng thái email'
        >
          <Option value=''>Tất cả</Option>
          {Object.values(EmailState).map((type) => (
            <Option key={type} value={type}>
              {t(`EMAIL_LOG.EMAIL_STATE.${type}`)}
            </Option>
          ))}
        </Select>

        <label className='font-medium'>{t('EMAIL_LOG.LABEL.EMAIL_TYPE')}</label>
        <Select
          value={tempFilter.emailType}
          onChange={(value) => setTempFilter({ ...tempFilter, emailType: value })}
          placeholder='Loại email'
        >
          <Option value=''>Tất cả</Option>
          {Object.values(EmailType).map((type) => (
            <Option key={type} value={type}>
              {t(`EMAIL_LOG.EMAIL_TYPE.${type}`)}
            </Option>
          ))}
        </Select>

        <label className='font-medium'>{t('EMAIL_LOG.LABEL.SEMESTER_NAME')}</label>
        <Input
          value={tempFilter.semesterName}
          onChange={(value) => setTempFilter({ ...tempFilter, semesterName: value.target.value })}
          placeholder='Ví dụ: Spring2025'
        />

        <label className='font-medium'>{t('EMAIL_LOG.LABEL.SEND_DATE')}</label>
        <RangePicker
          format='DD-MM-YYYY'
          value={dateRange}
          onChange={(dates) => {
            if (dates) {
              const startDate = dates[0]?.startOf('day') || null
              const endDate = dates[1]?.endOf('day') || null

              setDateRange([startDate, endDate])
              setTempFilter({
                ...tempFilter,
                minCreatedDate: startDate ? startDate.toDate() : undefined,
                maxCreatedDate: endDate ? endDate.toDate() : undefined,
              })
            } else {
              setDateRange(null)
              setTempFilter({
                ...tempFilter,
                minCreatedDate: undefined,
                maxCreatedDate: undefined,
              })
            }
          }}
        />

        {/* Nút Lọc và Đặt lại */}
        <div className='flex justify-between'>
          <Button onClick={handleReset} danger>
            Đặt lại
          </Button>
          <Button type='primary' onClick={handleSubmit}>
            Lọc
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
