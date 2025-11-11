import { FC, ReactNode } from 'react'
import { Spin, Modal, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDeleteNoteMutation } from '#hooks/api/note/useNoteMutation.js'
import { StudentNoteResponse } from '#src/types/ResponseModel/StudentNoteResponse.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  staffDetails: StudentNoteResponse | undefined
  loading: boolean
}

const DeleteNote: FC<StaffModalProps> = ({
  isVisible,
  onClose,
  staffDetails,
  loading,
}: StaffModalProps): ReactNode => {
  const { mutate, isPending } = useDeleteNoteMutation()
  const { t, i18n } = useTranslation()
  const currentLanguage: string = i18n.language

  const handleConfirm = (): void => {
    if (!staffDetails?.id) return
    mutate(staffDetails.id, {
      onSuccess: (): void => {
        onClose()
      },
    })
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
                  __html: t('NOTES.DELETE_CONFIRMATION.TITLE', {
                    subject:
                      currentLanguage === 'vi'
                        ? staffDetails?.student.studentName +
                          ' - ' +
                          staffDetails?.noteType.vietnameseName
                        : staffDetails?.student.studentName +
                          ' - ' +
                          staffDetails?.noteType.englishName,
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

export default DeleteNote
