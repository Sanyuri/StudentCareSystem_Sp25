import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import ApplicationTypeModal from '#components/features/ApplicationType/ApplicationTypeModal.js'
import SettingIcon from '#assets/icon/Setting.svg?react'
const ApplicationComponent: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className={'p-2'}>
      <Button
        size='large'
        color='default'
        variant='outlined'
        icon={<SettingIcon />}
        onClick={(): void => setIsModalOpen(true)}
      >
        <span className={'font-semibold'}>{t('LAYOUT.APPLICATION_TYPE')}</span>
      </Button>
      <ApplicationTypeModal isOpen={isModalOpen} onClose={(): void => setIsModalOpen(false)} />
    </div>
  )
}

export default ApplicationComponent
