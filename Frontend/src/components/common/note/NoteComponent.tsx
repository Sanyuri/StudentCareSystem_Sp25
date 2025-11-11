import { Button } from 'antd'
import { FC, useState } from 'react'
import { NoteState } from '#types/Props/NoteProp.js'
import NoteIcon from '#assets/icon/Document.svg?react'
import { useNoteData } from '#hooks/api/note/useNoteData.js'
import NoteModal from '#components/common/note/NoteModal.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'

const NoteComponent: FC<NoteState> = ({ noteType, studentRecord, entityId }: NoteState) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { refetch } = useNoteData(entityId)

  const { hasPermission } = useCheckPermission()
  const hasReadNotePermission = hasPermission(PermissionType.ReadStudentNote)

  const showModal = async (): Promise<void> => {
    await refetch()
    setIsModalVisible(true)
  }

  const handleCloseModal = (): void => {
    setIsModalVisible(false)
  }
  if (!noteType || !hasReadNotePermission) {
    return null
  }
  return (
    <>
      <Button ghost type={'text'} onClick={showModal} icon={<NoteIcon />} />
      <NoteModal
        noteType={noteType}
        studentRecord={studentRecord}
        entityId={entityId}
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default NoteComponent
