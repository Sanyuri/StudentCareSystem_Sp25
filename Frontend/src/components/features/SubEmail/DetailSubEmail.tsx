import _ from 'lodash'
import { Modal, Spin } from 'antd'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import useTemplateStore from '#stores/templateState.js'
import { SubEmailResponse } from '#types/ResponseModel/ApiResponse.js'
import { convertToHtml } from '#components/common/react-quill/React-Quill.js'
import { useEmailTemplateTypeOptions } from '#utils/constants/EmailTemplate/index.js'
import EditIcon from '#assets/icon/Edit.svg?react'
interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  showModal: (userId: string, type: 'detail' | 'edit') => void
  subEmail: SubEmailResponse | undefined
  loading: boolean
}

const DetailSubEmail: FC<StaffModalProps> = ({
  isVisible,
  onClose,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showModal,
  subEmail,
  loading,
}: Readonly<StaffModalProps>): ReactNode => {
  const { t, i18n } = useTranslation()
  const { darkMode } = useTemplateStore()
  const currentLanguage: string = i18n.language
  const { emailTemplateTypeOptions } = useEmailTemplateTypeOptions()

  const handleEdit = (): void => {
    const ApplicationTypeId = subEmail?.id
    if (!ApplicationTypeId) return
    showModal(ApplicationTypeId, 'edit')
  }
  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      height={1000}
      width={650}
      title={<div className='text-lg font-bold h1'>{t(`SUB_EMAIL.MODAL.BUTTON.DETAIL`)}</div>}
    >
      {loading && (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      )}
      {!loading && subEmail && (
        <div className='p-4 space-y-4'>
          <div className='space-y-4'>
            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3 className='text-sm font-medium mb-2'>{t(`SUB_EMAIL.NAME.LABEL`)}</h3>
              <p>{subEmail?.name}</p>
            </div>

            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3 className='text-sm font-medium mb-2'>{t(`SUB_EMAIL.EMAIL_TYPE`)}</h3>
              <p>
                {_.get(_.find(emailTemplateTypeOptions, { value: subEmail.emailType }), 'label')}
              </p>
            </div>

            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3 className='text-sm font-medium mb-2'>{t(`SUB_EMAIL.DESCRIPTION`)}</h3>
              <p>
                {currentLanguage === 'vi'
                  ? subEmail.vietnameseDescription
                  : subEmail.englishDescription}
              </p>
            </div>
            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3 className='text-sm font-medium mb-2'>{t(`SUB_EMAIL.CONTENT.LABEL`)}</h3>
              <div className='space-y-4'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: convertToHtml(subEmail?.content ?? '', true),
                  }}
                />
              </div>
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              className={` ${darkMode ? 'bg-black hover:bg-gray-800 text-white border-black-100 hover:border-gray-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-100 hover:border-blue-200'} 
              rounded-full px-6 py-2 h-auto flex items-center`}
              onClick={handleEdit}
            >
              <EditIcon className='mr-2' />
              {t(`SUB_EMAIL.MODAL.BUTTON.EDIT`)}
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default DetailSubEmail
