import { Modal, Spin } from 'antd'
import { FC, ReactNode } from 'react'
import icon from '#utils/constants/icon.js'
import { useTranslation } from 'react-i18next'
import useTemplateStore from '#stores/templateState.js'
import { SubjectResponse } from '#src/types/ResponseModel/SubjectResponse.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  showModal: (userId: string, type: 'detail' | 'edit') => void
  staffDetails: SubjectResponse | undefined
  loading: boolean
}

const DetailSubject: FC<Readonly<StaffModalProps>> = ({
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

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      height={1000}
      width={600}
      title={<div className='text-lg font-bold h1'>{t(`SUBJECT.FORM.DETAIL_SUBJECT`)}</div>}
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
            <p className='text-xs  mx-3 my-auto'>{t(`SUBJECT.TABLE_COLUMN.SUBJECT_CODE`)}:</p>
            <p className='text-sm font-medium my-auto'>{staffDetails.subjectCode}</p>
          </div>
          <div className='p-3 rounded-md flex items-center'>
            <img src={icon.calendarEditIcon} className={`${darkMode ? 'invert' : ''}`} alt='' />
            <p className='text-xs  mx-3 my-auto'>{t(`SUBJECT.TABLE_COLUMN.SUBJECT_GROUP`)}:</p>
            <p className='text-sm font-medium my-auto'>{staffDetails.subjectGroup}</p>
          </div>
          <div className='space-y-4'>
            <div
              className='rounded-lg p-4 space-y-2'
              style={{
                backgroundColor: darkMode ? '#171717' : '#F9FAFB',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <h3 className='text-sm font-medium mb-2'>{t(`SUBJECT.FORM.LABEL.SUBJECT`)}</h3>
              <p>
                {currentLanguage === 'vi' ? staffDetails.vietnameseName : staffDetails.englishName}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default DetailSubject
