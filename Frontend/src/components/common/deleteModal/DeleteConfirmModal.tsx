import React, { FC, ReactNode } from 'react'
import { Button, Popconfirm } from 'antd'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '#assets/icon/Delete.svg?react'

interface DeleteConfirmModalProps {
  handleDelete: () => void
}

const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  handleDelete,
}: DeleteConfirmModalProps): ReactNode => {
  const { t } = useTranslation()

  return (
    <Popconfirm
      title={t('COMMON.CONFIRM_DELETE')}
      onConfirm={(): void => handleDelete()}
      okText={t('COMMON.CONFIRM')}
      cancelText={t('COMMON.CANCEL')}
    >
      <Button type={'text'} ghost icon={<DeleteIcon />} />
    </Popconfirm>
  )
}

export default DeleteConfirmModal
