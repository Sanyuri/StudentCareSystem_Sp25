import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ApplicationTypeResponse } from '#src/types/ResponseModel/ApplicationTypeResponse.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
interface HandleFunctionApplicationProps {
  ApplicationType: ApplicationTypeResponse
  type: string
  showModal: (emailId: string, type: 'detail' | 'edit' | 'delete') => void
}

const HandleFunctionApplicationType: FC<HandleFunctionApplicationProps> = ({
  ApplicationType,
  type,
  showModal,
}: HandleFunctionApplicationProps): ReactNode => {
  const { t } = useTranslation()

  const handleShowEditModal = (): void => {
    showModal(ApplicationType.id, 'edit')
  }
  const handleShowDeleteModal = (): void => {
    showModal(ApplicationType.id, 'delete')
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

export default HandleFunctionApplicationType
