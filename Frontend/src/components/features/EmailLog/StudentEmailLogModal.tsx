import { EmailLogResponse } from '#src/types/ResponseModel/EmailLogResponse.js'
import { Modal, Typography } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import HideValueSensitive from '#components/common/HideValueSensitive/HideValueSensitive.js'

interface StudentEmailLogModalProps {
  visible: boolean
  onClose: () => void
  emailData: EmailLogResponse
}

const StudentEmailLogModal: FC<StudentEmailLogModalProps> = ({ visible, onClose, emailData }) => {
  const { student } = emailData
  const { t } = useTranslation()
  const { Text } = Typography

  return (
    <Modal
      title={student.studentCode || ''}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {student && (
        <div style={{ marginTop: '24px' }}>
          <Text strong>{t('EMAIL_LOG.STUDENT_INFO.TITLE')}:</Text>
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.NAME')}: </Text>
            <Text>{student.studentName}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.STUDENT_CODE')}: </Text>
            <Text>{student.studentCode}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.EMAIL')}: </Text>
            <Text>{student.email}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.CLASS')}: </Text>
            <Text>{student.class}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.MAJOR')}: </Text>
            <Text>{student.major}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.SPECIALIZATION')}: </Text>
            <Text>{student.specialization}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.GENDER')}: </Text>
            <Text>{student.gender}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.PROGRESS')}: </Text>
            <Text>{student.progress}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.CURRENT_TERM_NO')}: </Text>
            <Text>{student.currentTermNo}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.MOBILE_PHONE')}: </Text>
            <Text>
              <HideValueSensitive data={student?.mobilePhone} />
            </Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>{t('EMAIL_LOG.STUDENT_INFO.PARENT_PHONE')}: </Text>
            <Text>{student.parentPhone}</Text>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default StudentEmailLogModal
