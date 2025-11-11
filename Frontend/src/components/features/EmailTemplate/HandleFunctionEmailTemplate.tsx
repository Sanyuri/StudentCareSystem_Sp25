import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { EmailTemplateResponse } from '#src/types/ResponseModel/ApiResponse.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
import { Button } from 'antd'
interface HandleFunctionEmailTemplateProps {
  EmailTemplate: EmailTemplateResponse
  type: string
  showModal: (emailId: string, type: 'edit' | 'delete', refetch: () => void) => void
}

const HandleFunctionEmailTemplate: FC<HandleFunctionEmailTemplateProps> = ({
  EmailTemplate,
  type,
  showModal,
}: HandleFunctionEmailTemplateProps): ReactNode => {
  const { t } = useTranslation()

  const handleShowEditModal = (): void => {
    showModal(EmailTemplate.id, 'edit', (): void => {
      // Call refetch function after update
    })
  }

  const handleShowDeleteModal = (): void => {
    showModal(EmailTemplate.id, 'delete', (): void => {
      // Call refetch function after delete
    })
  }

  return (
    <>
      {type === 'edit' ? (
        <Button
          ghost
          disabled={EmailTemplate.isSystemEmail}
          type={'text'}
          onClick={handleShowEditModal}
          aria-label={t('COMMON.EDIT_EMAIL_TEMPLATE')}
          icon={<EditIcon />}
        />
      ) : (
        <Button
          ghost
          type={'text'}
          disabled={EmailTemplate.isSystemEmail}
          onClick={handleShowDeleteModal}
          aria-label={t('COMMON.DELETE_EMAIL_TEMPLATE')}
          icon={<DeleteIcon />}
        />
      )}
    </>
  )
}

export default HandleFunctionEmailTemplate
