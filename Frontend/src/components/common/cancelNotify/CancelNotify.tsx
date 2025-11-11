import { Button, Modal } from 'antd'
import { t } from 'i18next'
import { FC, useState } from 'react'

interface CancelNotifyProps {
  onCancel: () => void // Định nghĩa kiểu của hàm onCancel
}

const CancelNotify: FC<CancelNotifyProps> = ({ onCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <Button
        type='default'
        onClick={showModal}
        style={{ flex: 1, padding: '0 8px', height: '45px' }}
      >
        {t('CANCEL_NOTIFICATION.BUTTON_CANCEL')}
      </Button>
      <Modal
        centered
        title={t('CANCEL_NOTIFICATION.MODAL.TITLE')}
        width={400}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => (
          <div className='flex gap-2.5'>
            <Button onClick={handleCancel} type='default' className='flex-1 px-2 h-[45px]'>
              {t('CANCEL_NOTIFICATION.BUTTON_CANCEL')}
            </Button>
            <Button
              type='primary'
              danger
              onClick={() => {
                handleCancel()
                onCancel()
              }}
              className='flex-1 px-2 h-[45px]'
            >
              {t('CANCEL_NOTIFICATION.BUTTON_CONFIRM')}
            </Button>
          </div>
        )}
      >
        <span>{t('CANCEL_NOTIFICATION.MODAL.CONTENT')}</span>
      </Modal>
    </>
  )
}

export default CancelNotify
