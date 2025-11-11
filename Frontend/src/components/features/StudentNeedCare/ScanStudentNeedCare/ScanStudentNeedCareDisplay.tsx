import { t } from 'i18next'
import { FC, useState } from 'react'
import usePagination from '#hooks/usePagination.js'
import { Breakpoint, Grid, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table/index.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import { ExportStudentCareScan } from './ExportStudentCareScan'
import InputDebounce from '#components/common/input/InputDebounce.js'
import { StudentNeedCareModel } from '#types/Data/StudentNeedCare.js'
import { useScanListStudentNeedCareData } from '#hooks/api/studentNeedCare/useStudentNeedCareData.js'
import useColumScanStudentCareStep from '#components/features/StudentNeedCare/ScanStudentNeedCare/ColumnScanStudentCareTableStep.js'

const { useBreakpoint } = Grid

interface SecondStepScanStudentNeedCareProps {
  step: number
}

const ScanStudentNeedCareDisplay: FC<SecondStepScanStudentNeedCareProps> = ({
  step,
}: SecondStepScanStudentNeedCareProps) => {
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()

  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()

  const { data } = useScanListStudentNeedCareData({ query: searchTermDelayed }, page, pageSize)

  const columns: ColumnsType<StudentNeedCareModel> = useColumScanStudentCareStep(
    screens,
    step,
    page,
    pageSize,
  )

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Space
          style={{
            marginBottom: 16,
            width: '100%',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <InputDebounce
            value={searchTermDelayed}
            onDebouncedChange={setSearchTermDelayed}
            placeholder={t('ATTENDANCES.STUDENT_SEARCH_TERM')}
            style={{ width: 500 }}
            variant='filled'
            className='h-10'
            prefix={<GlassIcon />}
          />
          <Space>
            <ExportStudentCareScan totalItems={data?.totalItems ?? 1} type='scanned' />
          </Space>
        </Space>
        <div className={'px-6'}>
          <Table
            rowKey='studentCode'
            columns={columns}
            dataSource={data?.items}
            scroll={{ y: '37vh' }}
            bordered
            size='large'
            pagination={{
              showQuickJumper: true,
              current: page,
              onChange: handlePageChange,
              total: data?.totalItems,
              defaultPageSize: pageSizeRef.current,
              showSizeChanger: true,
              position: ['bottomCenter'],
              showTotal: (total: number): string => t('COMMON.TOTAL_RECORDS', { total }),
              align: 'start',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ScanStudentNeedCareDisplay
