import { FC, useState } from 'react'
import { Button } from 'antd'
import { StudentPsychologyService } from '#src/services/StudentPsychologyService.js'
import { navigate } from 'vike/client/router'
import AddStudentPsychologyModal from '#components/features/StudentPsychology/AddStudentPsychologyModal.js'
import { PlusOutlined } from '@ant-design/icons'

interface AddStudentCarePsychologyProps {
  studentCode: string
}

const AddStudentCarePsychology: FC<AddStudentCarePsychologyProps> = ({ studentCode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleVisibleModal = async (code: string) => {
    try {
      const currentStudentPsychology = await StudentPsychologyService.getStudentPsychology({
        studentCode: code,
      })
      if (currentStudentPsychology) {
        await navigate(`/psychology-note/${currentStudentPsychology.id}`)
      } else {
        setIsModalVisible(true)
      }
    } catch (error) {
      setIsModalVisible(true)
    }
  }

  return (
    <div>
      <Button
        className='mr-2'
        type='primary'
        size='middle'
        icon={<PlusOutlined />}
        onClick={() => handleVisibleModal(studentCode)}
      >
        Cần tư vấn tâm lý
      </Button>
      <AddStudentPsychologyModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        studentCode={studentCode}
      />
    </div>
  )
}

export default AddStudentCarePsychology
