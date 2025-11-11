import { FC, ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Grid, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import useAccountColumn from './ColumnTableAccount'
import usePagination from '#hooks/usePagination.js'
import { RoleValue } from '#utils/constants/role.js'
import { AccountList } from '#types/ResponseModel/ApiResponse.js'
import { useAccountData } from '#hooks/api/account/useAccountData.js'
import { FilterStatus } from '#src/types/RequestModel/AccountListRequest.js'

const { useBreakpoint } = Grid

interface TableAccountProps {
  AccountType: FilterStatus
  searchTerm: string
  role: RoleValue | undefined
  showModal: (userId: string, type: 'detail' | 'edit' | 'delete') => void
}

const TableAccount: FC<TableAccountProps> = ({
  AccountType,
  searchTerm,
  role,
  showModal,
}: TableAccountProps): ReactNode => {
  const { t } = useTranslation()
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()

  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { data, isFetching } = useAccountData(AccountType, role, searchTerm, page, pageSize)

  const columnData: ColumnProps<AccountList>[] = useAccountColumn(
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

export default TableAccount
