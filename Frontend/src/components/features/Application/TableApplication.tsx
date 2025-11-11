import { FC, ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import usePagination from '#hooks/usePagination.js'
import useApplicationColumn from './ColumnTableApplication'
import { ApplicationList } from '#types/ResponseModel/ApiResponse.js'
import { FilterApplication } from '#src/types/RequestModel/ApplicationRequest.js'
import { useApplicationData } from '#hooks/api/application/useApplicationData.js'

const { useBreakpoint } = Grid

interface TableApplicationProps {
  SearchTerm?: string
  ApplicationTypeId: string
  DateFrom: Date | undefined
  DateTo: Date | undefined
  Status: FilterApplication
  showModal: (userId: string, type: 'delete') => void
}

const TableApplication: FC<TableApplicationProps> = ({
  SearchTerm,
  ApplicationTypeId,
  DateFrom,
  DateTo,
  Status,
  showModal,
}: TableApplicationProps): ReactNode => {
  const { t } = useTranslation()

  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()

  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useApplicationData(
    ApplicationTypeId,
    Status,
    SearchTerm,
    page,
    pageSize,
    DateFrom,
    DateTo,
  )

  const columnData: ColumnProps<ApplicationList>[] = useApplicationColumn(
    screens,
    page,
    pageSize,
    showModal,
  )
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

export default TableApplication
