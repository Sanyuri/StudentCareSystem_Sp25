import { Button } from 'antd'
import { FC, ReactNode, useState } from 'react'
import { NoteStudentComponentProp } from '#types/Props/NoteProp.js'
import { useNoteStudentData } from '#hooks/api/note/useNoteData.js'
import NoteStudentModal from '#components/features/StudentManagement/NoteStudentModal.js'
import NoteIcon from '#assets/icon/Document.svg?react'
const NoteStudentComponent: FC<NoteStudentComponentProp> = ({
  studentRecord,
}: NoteStudentComponentProp): ReactNode => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { refetch } = useNoteStudentData(studentRecord.studentCode)
  const showModal = (): void => {
    void refetch()
    setIsModalVisible(true)
  }

  const handleCloseModal = (): void => {
    setIsModalVisible(false)
  }
  return (
    <>
      <Button ghost type={'text'} onClick={showModal} icon={<NoteIcon />} />
      <NoteStudentModal
        studentRecord={studentRecord}
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default NoteStudentComponent
