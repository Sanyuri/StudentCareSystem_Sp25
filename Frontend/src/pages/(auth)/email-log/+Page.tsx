import GlassIcon from '#components/common/icon/GlassIcon.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import { EmailLogFilter } from '#components/features/EmailLog/EmailLogFilter.js'
import EmailLogTable from '#components/features/EmailLog/TableEmailLog.js'
import { EmailLogRequest } from '#src/types/RequestModel/EmailLogRequest.js'
import { Button } from 'antd'
import { FC, Fragment, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FilterIcon from '#assets/icon/Filter.svg?react'
export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<EmailLogRequest>({
    pageNumber: 1,
    pageSize: 10,
    searchValue: '', // Field for search
    emailState: '', // Semester
    emailType: '', // Email type
    semesterName: '', // Semester
    minCreatedDate: undefined,
    maxCreatedDate: undefined,
  })

  const showDrawer = (): void => {
    setOpen(true)
  }

  const onClose = (): void => {
    setOpen(false)
  }

  const handleFilterChange = (newFilter: EmailLogRequest) => {
    setFilter(newFilter)
  }

  return (
    <Fragment>
      <section className='flex flex-wrap gap-10 justify-between items-start w-full text-sm leading-6 max-md:max-w-full'>
        <div className='min-w-[400px] max-md:max-w-full'>
          <InputDebounce
            value={filter.searchValue}
            onDebouncedChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                searchValue: typeof value === 'string' ? value : '',
                pageNumber: 1,
              }))
            }
            placeholder={'Tìm kiếm'}
            style={{ width: 500 }}
            variant='filled'
            className='h-10'
            prefix={<GlassIcon />}
          />
        </div>
        <div className='flex flex-wrap gap-3 items-center justify-end min-w-[240px] max-md:max-w-full'>
          <div className='flex gap-2 items-center self-stretch '>
            <Button
              color='primary'
              variant='outlined'
              size='large'
              onClick={showDrawer}
              icon={<FilterIcon />}
            >
              <span className='font-semibold'>{t('COMMON.FILTER')}</span>
            </Button>
            <EmailLogFilter
              filter={filter}
              open={open}
              onClose={onClose}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </section>
      <div className='mt-4'>
        <EmailLogTable filter={filter} onFilterChange={handleFilterChange} />
      </div>
    </Fragment>
  )
}
