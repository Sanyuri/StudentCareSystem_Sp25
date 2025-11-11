import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { NoteModel } from '#types/Data/NoteModel.js'
import { useNoteManagementData } from '#hooks/api/note/useNoteData.js'
import useNoteColumn from '#components/features/Note/ColumnTableNote.js'
import { FC, ReactNode } from 'react'
import usePagination from '#hooks/usePagination.js'

const { useBreakpoint } = Grid
const TableNote: FC<{
  filter: string
  searchTerm: string
  showModal: (userId: string, type: 'detail' | 'edit' | 'delete') => void
  onStudentCodeClick: (studentCode: string) => void
}> = ({
  filter,
  searchTerm,
  showModal,
  onStudentCodeClick,
}: {
  filter: string
  searchTerm: string
  showModal: (userId: string, type: 'detail' | 'edit' | 'delete') => void
  onStudentCodeClick: (studentCode: string) => void
}): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()

  const { data, isFetching } = useNoteManagementData(searchTerm, filter, page, pageSize)

  const columnData: ColumnProps<NoteModel>[] = useNoteColumn(
    screens,
    page,
    pageSize,
    searchTerm,
    onStudentCodeClick,
    showModal,
  ) // Pass searchTerm as the fourth argument
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

export default TableNote
