import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AccountList } from '#src/types/ResponseModel/ApiResponse.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
interface HandleFunctionAccountProps {
  AccountData: AccountList
  type: string
  showModal: (userId: string, type: 'detail' | 'edit' | 'delete') => void
  disabled?: boolean
}

const HandleFunctionAccount: FC<HandleFunctionAccountProps> = ({
  AccountData,
  type,
  showModal,
  disabled: disabled = false,
}: HandleFunctionAccountProps): ReactNode => {
  const { t } = useTranslation()

  const handleShowEditModal = (): void => {
    showModal(AccountData.id, 'edit')
  }
  const handleShowDeleteModal = (): void => {
    showModal(AccountData.id, 'delete')
  }

  return (
    <>
      {type === 'Edit' ? (
        <button
          onClick={handleShowEditModal}
          className='icon-button'
          aria-label={t('COMMON.EDIT_ACCOUNT')}
          disabled={disabled}
        >
          <EditIcon />
        </button>
      ) : (
        <button
          onClick={handleShowDeleteModal}
          className='icon-button'
          aria-label={t('COMMON.DELETE_ACCOUNT')}
          disabled={disabled}
        >
          <DeleteIcon />
        </button>
      )}
    </>
  )
}

export default HandleFunctionAccount
