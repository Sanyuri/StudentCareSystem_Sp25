import moment from 'moment'
import { Modal, Spin } from 'antd'
import { FC, ReactNode } from 'react'
import icon from '#utils/constants/icon.js'
import { useTranslation } from 'react-i18next'
import useTemplateStore from '#stores/templateState.js'
import { StudentNoteResponse } from '#src/types/ResponseModel/StudentNoteResponse.js'
import EditIcon from '#assets/icon/Edit.svg?react'
interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  showModal: (userId: string, type: 'detail' | 'edit') => void
  staffDetails: StudentNoteResponse | undefined
  loading: boolean
}

const DetailNote: FC<Readonly<StaffModalProps>> = ({
  isVisible,
  onClose,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showModal,
  staffDetails,
  loading,
}: Readonly<StaffModalProps>): ReactNode => {
  const { t, i18n } = useTranslation()
  const { darkMode } = useTemplateStore()
  const currentLanguage: string = i18n.language

  const handleEdit = (): void => {
    const NoteId: string | undefined = staffDetails?.studentCode
    if (!NoteId) return
    showModal(NoteId, 'edit')
  }
  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      centered
      footer={null}
      styles={{
        body: {
          overflowX: 'hidden',
          maxHeight: '500px',
          paddingBottom: '20px',
          paddingRight: '20px',
        },
      }}
      width={600}
      title={<div className='text-lg font-bold h1'>{t(`NOTES.FORM.DETAIL_NOTES`)}</div>}
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
            <p className='text-xs  mx-3 my-auto'>{t(`NOTES.FORM.LABEL.CREATED_TIME`)}:</p>
            <p className='text-sm font-medium my-auto'>
              {moment(staffDetails.content).format('DD/MM/YYYY HH:mm:ss')}
            </p>
          </div>
          <div className='p-3 rounded-md flex items-center'>
            <img src={icon.calendarEditIcon} className={`${darkMode ? 'invert' : ''}`} alt='' />
            <p className='text-xs  mx-3 my-auto'>{t(`NOTES.FORM.LABEL.UPDATED_TIME`)}:</p>
            <p className='text-sm font-medium my-auto'>
              {moment(staffDetails.content).format('DD/MM/YYYY HH:mm:ss')}
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
              <h3 className='text-sm font-medium mb-2'>{t(`NOTES.FORM.LABEL.SUBJECT`)}</h3>
              <p>{currentLanguage === 'vi' ? staffDetails.studentCode : ''}</p>
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              className={` ${darkMode ? 'bg-black hover:bg-gray-800 text-white border-black-100 hover:border-gray-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-100 hover:border-blue-200'} 
              rounded-full px-6 py-2 h-auto flex items-center`}
              onClick={handleEdit}
            >
              <EditIcon />
              {t(`NOTES.FORM.LABEL.EDIT`)}
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
export default DetailNote
