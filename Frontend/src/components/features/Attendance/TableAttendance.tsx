import { FC, ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import usePagination from '#hooks/usePagination.js'
import useAttendanceColumn from './ColumnTableAttendance'
import { StudentAttendance } from '#types/ResponseModel/ApiResponse.js'
import { useAttendanceData } from '#hooks/api/attendance/useAttendanceData.js'
import { AttendanceFilter } from '#src/types/RequestModel/AttendanceRequest.js'

const { useBreakpoint } = Grid

interface TableAttendanceProps {
  filter: AttendanceFilter
  searchTerm: string
}

const TableAttendance: FC<TableAttendanceProps> = ({
  filter,
  searchTerm,
}: TableAttendanceProps): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useAttendanceData(searchTerm, filter, page, pageSize)

  const columnData: ColumnProps<StudentAttendance>[] = useAttendanceColumn(screens, page, pageSize)
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
      dataSource={data?.items}
    />
  )
}

export default TableAttendance
