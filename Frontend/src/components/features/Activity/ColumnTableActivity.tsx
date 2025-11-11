import { Breakpoint } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { AccountList, ActivityList } from '#src/types/ResponseModel/ApiResponse.js'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'

const useActivityColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
): ColumnProps<ActivityList>[] => {
  const { t } = useTranslation()
  const currentLanguage = localStorage.getItem('i18nextLng')?.split('-')[0] ?? 'en'
  return [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: unknown, __: ActivityList, index: number) => (page - 1) * pageSize + index + 1,
    },
    {
      title: t('ACTIVITIES.TABLE_COLUMN.CREATED_AT'), // Dùng t('key') để dịch
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (createdAt: Date) => convertToLocalDateTime(createdAt.toString()),
    },
    {
      title: t('ACTIVITIES.TABLE_COLUMN.USER_NAME'),
      dataIndex: 'user',
      key: 'userName',
      align: 'center',
      width: 110,
      render: (user: AccountList) => <span>{user.email}</span>,
    },
    {
      title: t('ACTIVITIES.TABLE_COLUMN.FULL_NAME'),
      key: 'fullName',
      dataIndex: 'user',
      align: 'center',
      width: 110,
      render: (user: AccountList) => <span>{user.fullName}</span>,
    },
    {
      title: t('ACTIVITIES.TABLE_COLUMN.ROLE'),
      key: 'role',
      dataIndex: 'user',
      align: 'center',
      width: 110,
      render: (record: AccountList) => {
        return (
          <span>
            {currentLanguage === 'vi' ? record?.role?.vietNameseName : record?.role?.englishName}
          </span>
        )
      },
    },
    {
      title: t('ACTIVITIES.TABLE_COLUMN.ACTIVITY_TYPE_NAME'),
      key: 'activityTypeName',
      dataIndex: 'activityTypeName',
      align: 'center',
      width: 110,
      render: (activityTypeName: string) =>
        t(`ACTIVITIES.ACTIVITIES_OPTIONS.${activityTypeName.toUpperCase()}`),
    },
    {
      title: t('ACTIVITIES.TABLE_COLUMN.DESCRIPTION'),
      key: 'description',
      dataIndex: 'description',
      align: 'center',
      width: 110,
    },
  ]
}

export default useActivityColumn
