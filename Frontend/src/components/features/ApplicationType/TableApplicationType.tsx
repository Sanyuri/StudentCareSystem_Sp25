import { FC, ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import usePagination from '#hooks/usePagination.js'
import useApplicationTypeColumn from './ColumnApplicationType'
import { ApplicationTypeResponse } from '#types/ResponseModel/ApplicationTypeResponse.js'
import { useApplicationTypeData } from '#hooks/api/applicationType/useApplicationTypeData.js'

const { useBreakpoint } = Grid

interface TableApplicationTypeProps {
  searchTerm: string
  showModal: (userId: string, type: 'detail' | 'edit' | 'delete') => void
}

const TableApplicationType: FC<TableApplicationTypeProps> = ({
  searchTerm,
  showModal,
}: TableApplicationTypeProps): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useApplicationTypeData(searchTerm, page, pageSize)

  const columnData: ColumnProps<ApplicationTypeResponse>[] = useApplicationTypeColumn(
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

export default TableApplicationType
