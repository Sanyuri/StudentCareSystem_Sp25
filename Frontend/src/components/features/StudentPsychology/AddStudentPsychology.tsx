import { FC, useState } from 'react'
import { Button } from 'antd'
import { StudentPsychologyService } from '#src/services/StudentPsychologyService.js'
import { navigate } from 'vike/client/router'
import AddStudentPsychologyModal from './AddStudentPsychologyModal'
import PsychologyIcon from '#assets/icon/psychology.svg?react'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'

interface AddStudentPsychologyProps {
  studentCode: string
}

const AddStudentPsychology: FC<AddStudentPsychologyProps> = ({ studentCode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WriteStudentPsychology)
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
        ghost
        size='middle'
        icon={<PsychologyIcon />}
        onClick={() => handleVisibleModal(studentCode)}
      ></Button>
      {hasEditPermission && (
        <AddStudentPsychologyModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          studentCode={studentCode}
        />
      )}
    </div>
  )
}

export default AddStudentPsychology
