import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useEffect } from 'react'
import usePagination from '#hooks/usePagination.js'
import { StudentModel } from '#types/Data/StudentModel.js'
import { AttendanceFilter } from '#src/types/RequestModel/AttendanceRequest.js'
import { useStudentManagementData } from '#hooks/api/student/useStudentManagementData.js'
import useStudentColumn from '#components/features/StudentManagement/ColumnTableStudent.js'

const { useBreakpoint } = Grid

interface TableStudentProps {
  filter: AttendanceFilter
  searchTerm: string
  setLastUpdate: (lastUpdate: string) => void
}

const TableStudent: FC<TableStudentProps> = ({
  filter,
  searchTerm,
  setLastUpdate,
}: TableStudentProps): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useStudentManagementData(searchTerm, filter, page, pageSize)

  useEffect(() => {
    const now = new Date()
    const formattedDate = now.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    setLastUpdate(formattedDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.lastUpdated])

  const columnData: ColumnProps<StudentModel>[] = useStudentColumn(screens, page, pageSize)
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

export default TableStudent
