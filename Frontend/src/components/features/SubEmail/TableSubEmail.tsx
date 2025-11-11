import { FC, ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import useSubEmailColumn from './ColumnSubEmail.js'
import usePagination from '#hooks/usePagination.js'
import { SubEmailResponse } from '#types/ResponseModel/ApiResponse.js'
import { useSubEmailTemplateData } from '#hooks/api/subEmail/useSubEmailData.js'

const { useBreakpoint } = Grid

interface TableSubEmailProps {
  searchTerm: string
  showModal: (subEmailId: string, type: 'detail' | 'edit' | 'delete') => void
}

const TableSubEmail: FC<TableSubEmailProps> = ({
  searchTerm,
  showModal,
}: TableSubEmailProps): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useSubEmailTemplateData(searchTerm, '', page, pageSize)

  const columnData: ColumnProps<SubEmailResponse>[] = useSubEmailColumn(
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

export default TableSubEmail
