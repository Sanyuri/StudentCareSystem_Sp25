import { FC } from 'react'
import { Modal, Descriptions } from 'antd'
import { StudentModel } from '#types/Data/StudentModel.js'
import HideValueSensitive from '#components/common/HideValueSensitive/HideValueSensitive.js'
import { t } from 'i18next'

interface StudentInfoModalProps {
  visible: boolean
  onClose: () => void
  studentInfo: StudentModel | undefined
}

const StudentInfoModal: FC<StudentInfoModalProps> = ({
  visible,
  onClose,
  studentInfo,
}: StudentInfoModalProps) => (
  <Modal
    title={t('STUDENT_INFO.MODAL.TITLE')}
    open={visible}
    onCancel={onClose}
    footer={null}
    width={800}
    centered
  >
    {studentInfo ? (
      <Descriptions
        bordered
        column={1}
        labelStyle={{ width: '200px', whiteSpace: 'nowrap' }}
        contentStyle={{ minWidth: '300px' }}
      >
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.STUDENT_CODE')}>
          {studentInfo.studentCode}
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.STUDENT_NAME')}>
          {studentInfo.studentName}
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.CLASS')}>
          {studentInfo.class}
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.MAJOR')}>
          {studentInfo.major}
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.EMAIL')}>
          {' '}
          <HideValueSensitive data={studentInfo.email} />
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.GENDER')}>
          {studentInfo.gender}
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.PROGRESS')}>
          {studentInfo.progress}
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.STATUS')}>
          {studentInfo.statusCode}
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.CURRENT_TERM_NO')}>
          {studentInfo.currentTermNo}
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.SPECIALIZATION')}>
          {studentInfo.specialization}
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.MOBILE_PHONE')}>
          <HideValueSensitive data={studentInfo.mobilePhone} />
        </Descriptions.Item>
        <Descriptions.Item label={t('STUDENT_INFO.MODAL.PARENT_PHONE')}>
          <HideValueSensitive data={studentInfo.parentPhone} />
        </Descriptions.Item>
      </Descriptions>
    ) : (
      <p>{t('STUDENT_INFO.MODAL.NO_STUDENT')}</p>
    )}
  </Modal>
)

export default StudentInfoModal
