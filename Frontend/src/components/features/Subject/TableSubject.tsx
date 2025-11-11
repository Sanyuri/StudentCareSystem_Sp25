import { Grid, Table } from 'antd'
import { FC, ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import useSubjectColumn from './ColumnSubject'
import usePagination from '#hooks/usePagination.js'
import { useSubjectData } from '#hooks/api/subject/useSubjectData.js'
import { SubjectResponse } from '#types/ResponseModel/SubjectResponse.js'

const { useBreakpoint } = Grid

interface TableSubjectProps {
  searchTerm: string
  showModal: (userId: string, type: 'detail' | 'edit' | 'delete') => void
}

const TableSubject: FC<TableSubjectProps> = ({
  searchTerm,
  showModal,
}: TableSubjectProps): ReactNode => {
  const { t } = useTranslation()
  const screens = useBreakpoint()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useSubjectData(searchTerm, page, pageSize)

  const columnData: ColumnProps<SubjectResponse>[] = useSubjectColumn(
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

export default TableSubject
