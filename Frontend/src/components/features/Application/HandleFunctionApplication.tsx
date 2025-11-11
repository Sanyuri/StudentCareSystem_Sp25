import { Button } from 'antd'
import { FC, ReactNode } from 'react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
import { ApplicationList } from '#src/types/ResponseModel/ApiResponse.js'

interface HandleFunctionApplicationProps {
  ApplicationData: ApplicationList
  type: string
  showModal: (applicationId: string, type: 'delete') => void
}

const HandleFunctionApplication: FC<HandleFunctionApplicationProps> = ({
  ApplicationData,
  showModal,
}: HandleFunctionApplicationProps): ReactNode => {
  const handleShowDeleteModal = (): void => {
    showModal(ApplicationData.id, 'delete')
  }

  return <Button ghost type={'text'} onClick={handleShowDeleteModal} icon={<DeleteIcon />} />
}

export default HandleFunctionApplication
