import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, Fragment, ReactNode } from 'react'
import StudentCareRating from './StudentCareRating'
import StudentCareProgress from './StudentCareProgress'
import { StudentNeedCareModel } from '#src/types/Data/StudentNeedCare.js'

interface StudentCareHistoryModalProps {
  currentRating: StudentNeedCareModel | undefined
  isModalOpen: boolean
  handleClose: () => void
}

const StudentCareHistoryModal: FC<StudentCareHistoryModalProps> = ({
  currentRating,
  isModalOpen,
  handleClose,
}: StudentCareHistoryModalProps): ReactNode => {
  const { t } = useTranslation()
  return (
    <Fragment>
      {currentRating && (
        <Modal
          centered
          open={isModalOpen}
          title={currentRating.student.studentName + ' - ' + currentRating.semesterName}
          onCancel={handleClose}
          okText={t('COMMON.CONFIRM')}
          cancelText={t('COMMON.CANCEL')}
          footer={null}
          width={1000}
          styles={{
            body: {
              maxHeight: '80vh',
              overflowY: 'auto',
              paddingRight: 16,
            },
          }}
        >
          <StudentCareRating studentCareData={currentRating} />

          <div className='mt-6'>
            <StudentCareProgress studentCareId={currentRating.id} canEdit={false} />
          </div>
        </Modal>
      )}
    </Fragment>
  )
}

export default StudentCareHistoryModal
