import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, ReactElement, useState } from 'react'
import SubEmailModal from '#components/features/SubEmail/SubEmailModal.js'
import SettingIcon from '#assets/icon/Setting.svg?react'
const SubEmailComponent: FC = (): ReactElement => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className='ml-auto'>
      <Button
        size='large'
        color='default'
        variant='outlined'
        icon={<SettingIcon />}
        onClick={(): void => setIsModalOpen(true)}
      >
        <span className={'font-semibold'}>{t('SUB_EMAIL.MODAL.BUTTON.MANAGE')}</span>
      </Button>
      <SubEmailModal isOpen={isModalOpen} onClose={(): void => setIsModalOpen(false)} />
    </div>
  )
}

export default SubEmailComponent
