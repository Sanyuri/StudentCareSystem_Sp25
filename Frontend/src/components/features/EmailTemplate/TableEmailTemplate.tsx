import { FC, ReactNode } from 'react'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import usePagination from '#hooks/usePagination.js'
import useEmailTemplateColumn from './ColumnEmailTemplate'
import { useEmailTemplateData } from '#hooks/api/emailTemplate/useEmailTemplateData.js'

const { useBreakpoint } = Grid

interface TableEmailTemplateProps {
  searchTerm: string
  showModal: (userId: string, type: 'detail' | 'edit' | 'delete') => void
}

const TableEmailTemplate: FC<TableEmailTemplateProps> = ({
  searchTerm,
  showModal,
}: TableEmailTemplateProps): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useEmailTemplateData(searchTerm, undefined, page, pageSize)

  const columnData = useEmailTemplateColumn(screens, page, pageSize, showModal)
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

export default TableEmailTemplate
