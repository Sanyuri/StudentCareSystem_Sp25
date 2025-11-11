import { FC, Fragment, useState } from 'react'
import EmailDeferModal from '#components/features/Defer/EmailDeferModal.js'
import { Button } from 'antd'
import { t } from 'i18next'
import EmailSend from '#assets/icon/email send.svg?react'
const EmailDefer: FC = () => {
  const [modalVisible, setModalVisible] = useState(false)

  const showModal = () => {
    setModalVisible(true)
  }

  const hideModal = () => {
    setModalVisible(false)
  }

  return (
    <Fragment>
      <Button
        size='large'
        color='default'
        variant='outlined'
        onClick={showModal}
        icon={<EmailSend />}
      >
        <span className='font-semibold'>{t('DEFERS.DEFER_BUTTON')}</span>
      </Button>
      <EmailDeferModal visible={modalVisible} onClose={hideModal} />
    </Fragment>
  )
}

export default EmailDefer
