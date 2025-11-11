import { FC, ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import usePagination from '#hooks/usePagination.js'
import useActivityColumn from './ColumnTableActivity'
import { ActivityList } from '#types/ResponseModel/ApiResponse.js'
import { useActivityData } from '#hooks/api/activity/useActivityData.js'
import { FilterActivity } from '#src/types/RequestModel/ActivityRequest.js'

const { useBreakpoint } = Grid

interface TableActivityProps {
  fromDate: Date
  toDate: Date
  activityType: FilterActivity
  searchTerm: string
}

const TableActivity: FC<TableActivityProps> = ({
  fromDate,
  toDate,
  activityType,
  searchTerm,
}: TableActivityProps): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()

  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useActivityData(
    fromDate,
    toDate,
    activityType,
    searchTerm,
    page,
    pageSize,
  )

  const columnData: ColumnProps<ActivityList>[] = useActivityColumn(screens, page, pageSize)
  return (
    <Table
      loading={isFetching}
      rowKey='id'
      bordered
      size='large'
      columns={columnData}
      scroll={{ y: '48vh' }}
      sticky={{ offsetHeader: 64 }}
      pagination={{
        current: page,
        onChange: handlePageChange,
        total: data?.totalItems,
        defaultPageSize: pageSizeRef.current,
        showSizeChanger: true,
        position: ['bottomCenter'],
        showTotal: (total: number): string => t('COMMON.TOTAL_RECORDS', { total }),
        align: 'start',
      }}
      dataSource={data?.items}
    />
  )
}

export default TableActivity
