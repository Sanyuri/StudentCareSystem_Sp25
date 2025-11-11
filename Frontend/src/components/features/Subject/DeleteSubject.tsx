import { FC, ReactNode } from 'react'
import { Spin, Modal, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { DeleteSubjectRequest } from '#src/types/RequestModel/SubjectRequest.js'
import { useDeleteSubjectMutation } from '#hooks/api/subject/useSubjectMutation.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  staffDetails: DeleteSubjectRequest | undefined
  loading: boolean
}

const DeleteSubject: FC<StaffModalProps> = ({
  isVisible,
  onClose,
  staffDetails,
  loading,
}: StaffModalProps): ReactNode => {
  const { mutate, isPending } = useDeleteSubjectMutation()
  const { t, i18n } = useTranslation()
  const currentLanguage: string = i18n.language

  const handleConfirm = (): void => {
    mutate(
      {
        SubjectId: { id: staffDetails?.id ?? '' },
        deleteSubject: {
          id: staffDetails?.id ?? '',
          takeAttendance: true,
        },
      },
      {
        onSuccess: (): void => {
          // Close the modal upon successful mutation
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
                  __html: t('SUBJECT.FORM.DELETE_CONFIRMATION.TITLE', {
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

export default DeleteSubject
