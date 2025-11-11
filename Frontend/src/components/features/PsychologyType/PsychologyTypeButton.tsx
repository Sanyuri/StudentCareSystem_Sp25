import { Button } from 'antd'
import { FC, Fragment, ReactNode, useState } from 'react'
import AddIcon from '#assets/icon/Add.svg?react'
import PsychologyTypeModal from '#components/features/PsychologyType/PsychologyTypeModal.js'
import { t } from 'i18next'

const PsychologyTypeButton: FC = (): ReactNode => {
  // const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Fragment>
      <Button
        onClick={(): void => setIsModalOpen(true)}
        type='primary'
        size='middle'
        icon={<AddIcon />}
      >
        {t('STUDENT_PSYCHOLOGY.PSYCHOLOGY_MANAGEMENT')}
      </Button>
      <PsychologyTypeModal isOpen={isModalOpen} onClose={(): void => setIsModalOpen(false)} />
    </Fragment>
  )
}

export default PsychologyTypeButton
