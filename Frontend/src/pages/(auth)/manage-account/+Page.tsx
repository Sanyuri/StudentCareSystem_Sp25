import TableAccount from '#components/features/ManageAccount/TableAccount.js'
import { Select } from 'antd'
import React, { useState, ReactNode, FC, Fragment } from 'react'
import { FilterStatus } from '#src/types/RequestModel/AccountListRequest.js'
import { useAccountOptions } from '#utils/constants/Account/index.js'
import { useTranslation } from 'react-i18next'
import AddAccount from '#components/features/ManageAccount/AddAccount.js'
import DetailAccount from '#components/features/ManageAccount/DetailAccount.js'
import EditAccount from '#components/features/ManageAccount/EditAccount.js'
import { UserDetailsRequest } from '#src/types/RequestModel/ApiRequest.js'
import DeleteAccountModal from '#components/features/ManageAccount/DeleteAccountModal.js'
import { useUserData } from '#hooks/api/account/useAccountData.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import { RoleValue } from '#utils/constants/role.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { usePageContext } from 'vike-react/usePageContext'
import { PageContext } from 'vike/types'

export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const pageContext: PageContext = usePageContext()
  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const [accountType, setFilter] = useState<FilterStatus>('')
  const [role, setRole] = useState<RoleValue | undefined>(undefined)
  const { AccountFilterTableOptions } = useAccountOptions()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'detail' | 'edit' | 'delete' | null>(null) // Biến để theo dõi loại modal
  const [userDetailsRequest, setUserDetailsRequest] = useState<UserDetailsRequest | null>(null)
  const { data: selectedUser, isLoading } = useUserData(userDetailsRequest || { id: '' })

  const { hasPermission } = useCheckPermission()

  const hasEditPermission =
    hasPermission(PermissionType.WriteUser) || pageContext.user?.role === RoleValue.ADMIN

  const showModal = (userId: string, type: 'detail' | 'edit' | 'delete') => {
    setIsModalVisible(true)
    setModalType(type)
    setUserDetailsRequest({ id: userId }) // Set the userId which triggers the query
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setUserDetailsRequest(null)
    setModalType(null)
  }

  return (
    <Fragment>
      <section className='flex justify-between items-center w-full text-sm leading-6 max-md:max-w-full'>
        {/* Container for Input */}
        <div className='flex items-center min-w-[300px]'>
          <InputDebounce
            value={searchTermDelayed}
            onDebouncedChange={setSearchTermDelayed}
            placeholder={t('ACCOUNTS.ACCOUNTS_SEARCH_TERM')}
            style={{ width: 400 }}
            variant='filled'
            className='h-10'
            prefix={<GlassIcon />}
          />
        </div>

        {/* Container for Select and AddAccount */}
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-2 min-w-[240px]'>
            <label htmlFor='AccountFilter' className='font-medium'>
              {t('COMMON.SEARCH_STATUS')}:
            </label>
            <Select
              defaultValue=''
              size='large'
              style={{ width: 200 }}
              options={AccountFilterTableOptions}
              value={accountType}
              onChange={setFilter}
            />
          </div>
          <div className='flex items-center gap-2 min-w-[240px]'>
            <label htmlFor='RoleFilter' className='font-medium'>
              {t('COMMON.SEARCH_ROLE')}:
            </label>
            <Select
              defaultValue={undefined}
              size='large'
              style={{ width: 200 }}
              options={Object.values(RoleValue).map((role) => ({
                label: role,
                value: role,
              }))}
              value={role}
              onChange={setRole}
            />
          </div>
          {hasEditPermission && <AddAccount />}
        </div>
      </section>

      <div className='mt-4'>
        <TableAccount
          AccountType={accountType}
          searchTerm={searchTermDelayed}
          role={role}
          showModal={showModal}
        />
      </div>
      {modalType === 'detail' && (
        <DetailAccount
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          showModal={showModal}
          staffDetails={selectedUser}
          loading={isLoading}
        />
      )}
      {modalType === 'edit' && hasEditPermission && (
        <EditAccount
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          staffDetails={selectedUser}
          loading={isLoading}
        />
      )}

      {modalType === 'delete' && hasEditPermission && (
        <DeleteAccountModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          staffDetails={selectedUser}
          loading={isLoading}
        />
      )}
    </Fragment>
  )
}
