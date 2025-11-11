import moment from 'moment'
import { Modal, Spin } from 'antd'
import { FC, ReactNode } from 'react'
import icon from '#utils/constants/icon.js'
import { useTranslation } from 'react-i18next'
import useTemplateStore from '#stores/templateState.js'
import { convertToHtml, convertToHtmlCluster } from '#components/common/react-quill/React-Quill.js'
import { EmailTemplateResponse } from '#src/types/ResponseModel/ApiResponse.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import useAuthStore from '#stores/authState.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  showModal: (userId: string, type: 'detail' | 'edit') => void
  staffDetails: EmailTemplateResponse | undefined
  loading: boolean
}

const DetailEmailTemplate: FC<Readonly<StaffModalProps>> = ({
  isVisible,
  onClose,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showModal,
  staffDetails,
  loading,
}: Readonly<StaffModalProps>): ReactNode => {
  const { t } = useTranslation()
  const { darkMode } = useTemplateStore()
  const { role } = useAuthStore()

  const handleEdit = (): void => {
    const emailTemplateId: string | undefined = staffDetails?.id
    if (!emailTemplateId) return
    showModal(emailTemplateId, 'edit')
  }
  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={650}
      title={
        <div className='text-lg font-bold h1'>
          {t(`EMAILTEMPLATES.FORM.LABEL.DETAIL_EMAILTEMPLATE`)}
        </div>
      }
    >
      {loading && (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      )}
      {!loading && staffDetails && (
        <div className='p-4 space-y-4'>
          <div className='p-3 rounded-md flex items-center'>
            <img src={icon.calendarIcon} className={`${darkMode ? 'invert' : ''}`} alt='' />
            <p className='text-xs  mx-3 my-auto'>{t(`EMAILTEMPLATES.FORM.LABEL.CREATED_TIME`)}:</p>
            <p className='text-sm font-medium my-auto'>
              {moment(staffDetails.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </p>
          </div>
          <div className='p-3 rounded-md flex items-center'>
            <img src={icon.calendarEditIcon} className={`${darkMode ? 'invert' : ''}`} alt='' />
            <p className='text-xs  mx-3 my-auto'>{t(`EMAILTEMPLATES.FORM.LABEL.UPDATED_TIME`)}:</p>
            <p className='text-sm font-medium my-auto'>
              {moment(staffDetails.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </p>
          </div>
          <div className='space-y-4'>
            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3 className='text-sm font-medium mb-2'>{t(`EMAILTEMPLATES.FORM.LABEL.SUBJECT`)}</h3>
              <p>{staffDetails.subject}</p>
            </div>

            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3>{t('EMAILTEMPLATES.FORM.LABEL.CC_EMAILS')}</h3>
              <div>
                {staffDetails?.ccEmails.map((email, index) => <div key={index}>{email}</div>)}
              </div>
            </div>
            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3>{t('EMAILTEMPLATES.FORM.LABEL.BCC_EMAILS')}</h3>
              <div>
                {staffDetails?.bccEmails.map((email, index) => <div key={index}>{email}</div>)}
              </div>
            </div>
            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3>{t('EMAILTEMPLATES.FORM.LABEL.REPLY_TO_EMAIL')}</h3>
              <div>{staffDetails?.replyToEmail}</div>
            </div>
            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3 className='text-sm font-medium mb-2'>{t(`EMAILTEMPLATES.FORM.LABEL.CONTENT`)}</h3>
              <div className='space-y-4'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: convertToHtmlCluster(convertToHtml(staffDetails.content, true), true),
                  }}
                />
              </div>
            </div>
          </div>
          {role === 'Manager' && (
            <div className='flex justify-end'>
              <button
                className={` ${darkMode ? 'bg-black hover:bg-gray-800 text-white border-black-100 hover:border-gray-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-100 hover:border-blue-200'} 
              rounded-full px-6 py-2 h-auto flex items-center`}
                onClick={handleEdit}
              >
                <EditIcon /> {t(`EMAILTEMPLATES.FORM.LABEL.EDIT`)}
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

export default DetailEmailTemplate
