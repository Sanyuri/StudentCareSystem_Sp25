import { FC, ReactNode } from 'react'
import { Button, Modal, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { GetApplicationDetailResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { useDeleteApplicationMutation } from '#hooks/api/application/useApplicationMutation.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  staffDetails: GetApplicationDetailResponse | undefined
  loading: boolean
}

const DeleteAccountModal: FC<StaffModalProps> = ({
  isVisible,
  onClose,
  staffDetails,
  loading,
}: StaffModalProps): ReactNode => {
  const { mutate, isPending } = useDeleteApplicationMutation()
  const { t } = useTranslation()
  const handleConfirm = (): void => {
    mutate(
      {
        id: staffDetails?.id ?? '',
      },
      {
        onSuccess: (): void => {
          onClose()
        },
      },
    )
  }

  return (
    <>
      {isPending || loading ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : (
        <Modal
          open={isVisible}
          onCancel={onClose}
          centered
          closable={false}
          width={500}
          footer={() => (
            <div className='flex gap-2.5'>
              <Button
                color='primary'
                variant='outlined'
                onClick={onClose}
                style={{ flex: 1, padding: '0 8px', height: '45px' }}
              >
                {t(`COMMON.CANCEL`)}
              </Button>
              <Button
                type='primary'
                danger
                onClick={handleConfirm}
                style={{ flex: 1, padding: '0 8px', height: '45px' }}
              >
                {t(`COMMON.CONFIRM`)}
              </Button>
            </div>
          )}
        >
          <div className='p-6'>
            <div className='flex items-start mb-4'>
              <h2
                className='text-lg font-semibold mb-4'
                dangerouslySetInnerHTML={{
                  __html: t('APPLICATION.MODAL.DELETE', {
                    fullName: staffDetails?.studentName,
                  }),
                }}
              />
            </div>
            <p className=' mb-6'>{t('ACCOUNTS.FORM.DELETE_CONFIRMATION.CONTENT')} </p>
          </div>
        </Modal>
      )}
    </>
  )
}

export default DeleteAccountModal
