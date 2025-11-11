import { FC, ReactNode } from 'react'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import useDeferColumn from './ColumTableDefer'
import usePagination from '#hooks/usePagination.js'
import { useDeferData } from '#hooks/api/defer/userDeferData.js'

const { useBreakpoint } = Grid

interface TableDeferProps {
  searchTerm: string
  semesters: string | undefined
}

const TableDefer: FC<TableDeferProps> = ({
  //filter,
  searchTerm,
  semesters,
}: TableDeferProps): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()

  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useDeferData(searchTerm, semesters, page, pageSize)

  const columnData = useDeferColumn(screens, page, pageSize)
  return (
    <Table
      loading={isFetching}
      rowKey='studentCode'
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

export default TableDefer
