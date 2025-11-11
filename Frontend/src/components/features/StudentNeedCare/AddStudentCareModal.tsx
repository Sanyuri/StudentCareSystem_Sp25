import { FC, Fragment, useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { ScanOutlined, UserAddOutlined } from '@ant-design/icons'
import AddStudentCareManual from './AddStudentCareManual'

interface AddStudentCareModalProps {
  isOpen: boolean
  onClose: () => void
  setScanModalOpen: (value: boolean) => void
}

const AddStudentCareModal: FC<AddStudentCareModalProps> = ({
  isOpen,
  onClose,
  setScanModalOpen,
}: AddStudentCareModalProps) => {
  const { t } = useTranslation()

  const [isOpenManual, setIsOpenManual] = useState(false)
  return (
    <Fragment>
      <Modal
        title={t('STUDENT_NEED_CARE.ADD.MODAL.TITLE')}
        open={isOpen}
        onCancel={onClose}
        onClose={onClose}
        footer={null}
      >
        <div className='flex flex-col gap-4'>
          <Button
            type='primary'
            icon={<UserAddOutlined />}
            className='w-full'
            onClick={() => {
              setIsOpenManual(true)
              onClose()
            }}
          >
            {t('STUDENT_NEED_CARE.ADD.MODAL.ADD_MANUAL')}
          </Button>
          <Button
            type='default'
            icon={<ScanOutlined />}
            className='w-full'
            onClick={() => {
              onClose()
              setScanModalOpen(true)
            }}
          >
            {t('STUDENT_NEED_CARE.ADD.MODAL.ADD_AUTOMATIC')}
          </Button>
        </div>
      </Modal>
      <AddStudentCareManual isOpen={isOpenManual} onClose={() => setIsOpenManual(false)} />
    </Fragment>
  )
}

export default AddStudentCareModal
