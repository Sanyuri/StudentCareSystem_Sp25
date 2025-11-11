import { Modal } from 'antd'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

type ImagePreviewModalProps = {
  isVisible: boolean
  previewImage: string | ArrayBuffer | null
  onSubmit: () => void
  onCancel: () => void
  modalTitle: string
}
const ImagePreviewModal: FC<ImagePreviewModalProps> = ({
  isVisible,
  previewImage,
  onSubmit,
  onCancel,
  modalTitle,
}: ImagePreviewModalProps) => {
  const { t } = useTranslation()
  return (
    <Modal
      title={modalTitle}
      open={isVisible}
      onOk={onSubmit}
      onCancel={onCancel}
      okText={t('COMMON.CONFIRM')}
      cancelText={t('COMMON.CANCEL')}
    >
      <div className='flex justify-center items-center h-full text-center'>
        <img
          src={typeof previewImage === 'string' ? previewImage : undefined}
          alt='Preview'
          className='max-w-full max-h-[300px] rounded-lg'
        />
      </div>
    </Modal>
  )
}

export default ImagePreviewModal
