import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import NoteTypeModal from '#components/features/NoteType/NoteTypeModal.js'
import { SettingOutlined } from '@ant-design/icons'

const NoteTypeManage: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <Button
        icon={<SettingOutlined />}
        size='large'
        type={'primary'}
        onClick={(): void => setIsModalOpen(true)}
      >
        <span className='font-semibold'>{t('NOTE_TYPE.BUTTON.OPEN')}</span>
      </Button>
      <NoteTypeModal isOpen={isModalOpen} onClose={(): void => setIsModalOpen(false)} />
    </div>
  )
}

export default NoteTypeManage
