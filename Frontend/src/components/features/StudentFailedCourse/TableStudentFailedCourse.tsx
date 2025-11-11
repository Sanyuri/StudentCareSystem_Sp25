import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Breakpoint, Grid, Table } from 'antd'
import usePagination from '#hooks/usePagination.js'
import { ColumnProps } from 'antd/es/table/index.js'
import useStudentFailedCourseColumn from './ColumnStudentFailedCourse'
import { StudentFailedCourseResponse } from '#types/ResponseModel/StudentFailedCourseResponse.js'
import { useStudentFailedCourseData } from '#hooks/api/studentFailed/useStudentFailedCourseData.js'
import { PointStatus } from '#src/types/Enums/PointStatus.js'
import { FailReason } from '#src/types/Enums/FailReason.js'

const { useBreakpoint } = Grid

interface TableStudentFailedCourseProps {
  searchTerm: string
  failReason: FailReason | undefined
  semesters: string | undefined
  showModal: (Id: string, studentCode: string, type: 'detail') => void
}

const TableStudentFailedCourse: FC<TableStudentFailedCourseProps> = ({
  searchTerm,
  failReason,
  semesters,
  showModal,
}: TableStudentFailedCourseProps): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useStudentFailedCourseData(
    searchTerm,
    semesters,
    PointStatus.Failed,
    failReason,
    page,
    pageSize,
  )

  const columnData: ColumnProps<StudentFailedCourseResponse>[] = useStudentFailedCourseColumn(
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
        pageSize,
        total: data?.totalItems ?? 0,
        defaultPageSize: pageSizeRef.current,
        showSizeChanger: true,
        position: ['bottomCenter'],
        showTotal: (total: number): string => t('COMMON.TOTAL_RECORDS', { total }),
        onChange: handlePageChange,
        onShowSizeChange: handlePageChange,
      }}
      dataSource={data?.items}
    />
  )
}

export default TableStudentFailedCourse
