import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SubjectResponse } from '#src/types/ResponseModel/SubjectResponse.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
interface HandleFunctionSubjectProps {
  Subject: SubjectResponse
  type: string
  showModal: (emailId: string, type: 'detail' | 'edit' | 'delete') => void
}

const HandleFunctionSubject: FC<HandleFunctionSubjectProps> = ({
  Subject,
  type,
  showModal,
}: HandleFunctionSubjectProps): ReactNode => {
  const { t } = useTranslation()

  const handleShowEditModal = (): void => {
    showModal(Subject.id, 'edit')
  }
  const handleShowDeleteModal = (): void => {
    showModal(Subject.id, 'delete')
  }

  return (
    <>
      {type === 'Edit' ? (
        <button onClick={handleShowEditModal} aria-label={t('SUBJECT.COMMON.EDIT_SUBJECT')}>
          <EditIcon />
        </button>
      ) : (
        <button onClick={handleShowDeleteModal} aria-label={t('SUBJECT.COMMON.DELETE_SUBJECT')}>
          <DeleteIcon />
        </button>
      )}
    </>
  )
}

export default HandleFunctionSubject
