import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SubEmailResponse } from '#types/ResponseModel/ApiResponse.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
interface HandleFunctionApplicationProps {
  subEmail: SubEmailResponse
  type: string
  showModal: (emailId: string, type: 'detail' | 'edit' | 'delete') => void
}

const HandleFunctionSubEmail: FC<HandleFunctionApplicationProps> = ({
  subEmail,
  type,
  showModal,
}: HandleFunctionApplicationProps): ReactNode => {
  const { t } = useTranslation()

  const handleShowEditModal = (): void => {
    showModal(subEmail.id, 'edit')
  }
  const handleShowDeleteModal = (): void => {
    showModal(subEmail.id, 'delete')
  }

  return (
    <>
      {type === 'Edit' ? (
        <button onClick={handleShowEditModal} aria-label={t('COMMON.EDIT_EMAIL_TEMPLATE')}>
          <EditIcon />
        </button>
      ) : (
        <button onClick={handleShowDeleteModal} aria-label={t('COMMON.DELETE_EMAIL_TEMPLATE')}>
          <DeleteIcon />
        </button>
      )}
    </>
  )
}

export default HandleFunctionSubEmail
