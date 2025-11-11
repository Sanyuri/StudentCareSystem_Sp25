import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { NoteModel } from '#types/Data/NoteModel.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
const HandleFunctionNote: FC<{
  Note: NoteModel
  type: string
  showModal: (emailId: string, type: 'detail' | 'edit' | 'delete') => void
}> = ({
  Note,
  type,
  showModal,
}: {
  Note: NoteModel
  type: string
  showModal: (emailId: string, type: 'detail' | 'edit' | 'delete') => void
}): ReactNode => {
  const { t } = useTranslation()

  const handleShowEditModal = (): void => {
    showModal(Note.id, 'edit')
  }
  const handleShowDeleteModal = (): void => {
    showModal(Note.id, 'delete')
  }
  return (
    <>
      {type === 'Edit' ? (
        <button onClick={handleShowEditModal} aria-label={t('NOTES.COMMON.EDIT_NOTES')}>
          <EditIcon />
        </button>
      ) : (
        <button onClick={handleShowDeleteModal} aria-label={t('NOTES.COMMON.DELETE_NOTES')}>
          <DeleteIcon />
        </button>
      )}
    </>
  )
}

export default HandleFunctionNote
