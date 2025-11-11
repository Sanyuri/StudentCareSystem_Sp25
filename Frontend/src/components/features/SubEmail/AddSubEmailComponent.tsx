import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, Fragment, ReactElement, useState } from 'react'
import AddSubEmailModal from '#components/features/SubEmail/AddSubEmailModal.js'
import NoteIcon from '#assets/icon/Document.svg?react'
const AddSubEmailComponent: FC = (): ReactElement => {
  const { t } = useTranslation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const showModal = async (): Promise<void> => {
    setIsModalVisible(true)
  }

  const handleCloseModal = (): void => {
    setIsModalVisible(false)
  }
  return (
    <Fragment>
      <Button
        size='large'
        color='default'
        variant='outlined'
        onClick={showModal}
        icon={<NoteIcon />}
      >
        <span className='font-semibold'>{t('SUB_EMAIL.MODAL.BUTTON.ADD')}</span>
      </Button>
      <AddSubEmailModal visible={isModalVisible} onClose={handleCloseModal} />
    </Fragment>
  )
}

export default AddSubEmailComponent
