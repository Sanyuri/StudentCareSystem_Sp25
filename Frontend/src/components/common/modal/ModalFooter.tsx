import { Button } from 'antd'
import { t } from 'i18next'
import { FC } from 'react'

type ModalFooterProps = {
  handleCancel: () => void
  handleSubmitForm: () => void
}
const ModalFooter: FC<ModalFooterProps> = ({
  handleCancel,
  handleSubmitForm,
}: ModalFooterProps) => (
  <div className='flex gap-2.5'>
    <Button onClick={handleCancel} style={{ flex: 1, padding: '0 8px', height: '45px' }}>
      {t(`COMMON.CANCEL`)}
    </Button>
    <Button
      type='primary'
      onClick={handleSubmitForm}
      style={{ flex: 1, padding: '0 8px', height: '45px' }}
    >
      {t(`COMMON.CONFIRM`)}
    </Button>
  </div>
)

export default ModalFooter
