import { FC, ReactNode } from 'react'
import { Spin, Modal, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { DeleteApplicationTypeRequest } from '#src/types/RequestModel/ApplicationTypeRequest.js'
import { useDeleteApplicationTypeMutation } from '#hooks/api/applicationType/useApplicationTypeMutation.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  staffDetails: DeleteApplicationTypeRequest | undefined
  loading: boolean
}

const DeleteApplicationType: FC<StaffModalProps> = ({
  isVisible,
  onClose,
  staffDetails,
  loading,
}: StaffModalProps): ReactNode => {
  const { mutate, isPending } = useDeleteApplicationTypeMutation()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language
  const handleConfirm = (): void => {
    mutate(
      {
        applicationTypeId: { id: staffDetails?.id ?? '' },
      },
      {
        onSuccess: () => {
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
          footer={(): ReactNode => (
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
                  __html: t('APPLICATION_TYPE.FORM.DELETE_CONFIRMATION.TITLE', {
                    subject:
                      currentLanguage === 'vi'
                        ? staffDetails?.vietnameseName
                        : staffDetails?.englishName,
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

export default DeleteApplicationType
