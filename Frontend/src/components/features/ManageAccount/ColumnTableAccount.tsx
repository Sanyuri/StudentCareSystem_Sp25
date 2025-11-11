import { ReactNode } from 'react'
import { Breakpoint, Space, Tooltip } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import HandleFunctionAccount from './HandleFunctionAccount'
import { AccountList, Role } from '#src/types/ResponseModel/ApiResponse.js'
import { RoleValue } from '#utils/constants/role.js'
import useAuthStore from '#stores/authState.js'

const useAccountColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
  showModal: (userId: string, type: 'detail' | 'edit' | 'delete') => void,
): ColumnProps<AccountList>[] => {
  const { t } = useTranslation()
  const { role, email } = useAuthStore()
  const currentLanguage = localStorage.getItem('i18nextLng')?.split('-')[0] ?? 'en'
  return [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: unknown, __: AccountList, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('ACCOUNTS.FORM.LABEL.FULL_NAME'), // Dùng t('key') để dịch
      dataIndex: 'fullName',
      key: 'fullName',
      width: 120,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (text: string, record: AccountList): ReactNode => {
        const handleShowModal = (): void => {
          showModal(record.id, 'detail') // Move showModal logic here
        }
        return (
          <button
            onClick={handleShowModal} // Call the separate function
            style={{
              cursor: 'pointer',
              color: '#1890ff',
              background: 'none',
              border: 'none',
              padding: 0,
              textDecoration: 'underline',
            }} // Optional styling for clickable text
            aria-label={t('ACCOUNTS.FORM.LABEL.FULL_NAME')} // Add accessible label
          >
            {text}
          </button>
        )
      },
    },
    {
      title: t('ACCOUNTS.FORM.LABEL.EMAIL_ACCOUNT'),
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: 110,
    },
    {
      title: t('ACCOUNTS.FORM.LABEL.FE_EMAIL_ACCOUNT'),
      dataIndex: 'feEmail',
      key: 'feEmail',
      align: 'center',
      width: 110,
      render: (text: string): ReactNode => text || 'N/A',
    },
    {
      title: t('ACCOUNTS.FORM.LABEL.ROLE'),
      key: 'role',
      dataIndex: 'role',
      align: 'center',
      width: 110,
      render: (record: Role): ReactNode => {
        return <span>{currentLanguage === 'vi' ? record.vietNameseName : record.englishName}</span>
      },
    },
    {
      title: t('ACCOUNTS.FORM.LABEL.PERMISSIONS'),
      key: 'totalPermissions',
      dataIndex: 'totalPermissions',
      align: 'center',
      width: 100,
    },
    {
      title: t('ACCOUNTS.FORM.LABEL.STATUS'),
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      width: 110,
      render: (status: string): ReactNode => (
        <span
          className={`inline-block px-2 py-1 text-xs font-medium ${
            status === 'Inactive'
              ? 'text-red-700 bg-red-100 border-red-400'
              : 'text-green-700 bg-green-100 border-green-400'
          } rounded-full`}
        >
          {status === 'Inactive'
            ? t(`ACCOUNTS.FORM.LABEL.INACTIVE`)
            : t(`ACCOUNTS.FORM.LABEL.ACTIVE`)}
        </span>
      ),
    },

    {
      title: t('ACCOUNTS.FORM.LABEL.ACTION'),
      key: 'action',
      width: 110,
      fixed: !screens.xs ? 'right' : false,
      align: 'center',
      render: (_: unknown, record: AccountList): ReactNode => {
        const isCurrentUser = email === record.email

        // Check if this account has a standard user role
        const isRestrictedModify =
          // record.role.roleType === RoleValue.MANAGER || record.role.roleType === RoleValue.OFFICER
          () => {
            //Admin cannot modify other Admins except himself
            if (
              record.role.roleType === RoleValue.ADMIN &&
              role === RoleValue.ADMIN &&
              !isCurrentUser
            )
              return true
            //Manager cannot modify other Managers except himself
            if (
              (record.role.roleType === RoleValue.ADMIN ||
                record.role.roleType === RoleValue.MANAGER) &&
              role === RoleValue.MANAGER &&
              !isCurrentUser
            )
              return true
            //Officer cannot modify other Role except himself
            if (role === RoleValue.OFFICER && !isCurrentUser) return true
            return false
          }

        return (
          <Space size='middle' className={isCurrentUser ? 'current-user-row' : ''}>
            <Tooltip title={isRestrictedModify() ? t('ACCOUNTS.MESSAGE.CANNOT_EDIT_ACCOUNT') : ''}>
              <span>
                <HandleFunctionAccount
                  AccountData={record}
                  type={'Edit'}
                  showModal={showModal}
                  disabled={isRestrictedModify()}
                />
              </span>
            </Tooltip>

            <Tooltip
              title={isRestrictedModify() ? t('ACCOUNTS.MESSAGE.CANNOT_DELETE_ACCOUNT') : ''}
            >
              <span>
                <HandleFunctionAccount
                  AccountData={record}
                  type={'Delete'}
                  showModal={showModal}
                  disabled={true}
                />
              </span>
            </Tooltip>
          </Space>
        )
      },
    },
  ]
}

export default useAccountColumn
