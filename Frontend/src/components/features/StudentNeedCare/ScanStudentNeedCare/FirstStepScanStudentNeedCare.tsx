import { Input } from 'antd'
import { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next'

interface FirstStepScanStudentNeedCareProps {
  studentCount: string
  setStudentCount: (studentCount: string) => void
}

const FirstStepScanStudentNeedCare: FC<FirstStepScanStudentNeedCareProps> = ({
  studentCount,
  setStudentCount,
}: FirstStepScanStudentNeedCareProps) => {
  const { t } = useTranslation()
  return (
    <div style={{ padding: '24px 0' }}>
      <h2
        style={{
          margin: '0 0 8px 0',
          fontWeight: 'normal',
          fontSize: '20px',
          textAlign: 'center',
        }}
      >
        {t('STUDENT_NEED_CARE.SCAN.FIRST_STEP.TITLE')}
      </h2>
      <p style={{ color: '#666', margin: '0 0 24px 0', textAlign: 'center' }}>
        {t('STUDENT_NEED_CARE.SCAN.FIRST_STEP.DESCRIPTION')}
      </p>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '4px' }}>
          {t('STUDENT_NEED_CARE.SCAN.FIRST_STEP.COUNT')} <span style={{ color: '#ff4d4f' }}>*</span>
        </div>
        <Input
          value={studentCount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setStudentCount(e.target.value)}
          placeholder={t('STUDENT_NEED_CARE.SCAN.FIRST_STEP.INPUT')}
          suffix={t('STUDENT_NEED_CARE.SCAN.FIRST_STEP.SUFFIX')}
          style={{ width: '100%' }}
        />
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          {t('STUDENT_NEED_CARE.SCAN.FIRST_STEP.VALIDATION_MESSAGE')}
        </div>
      </div>
    </div>
  )
}

export default FirstStepScanStudentNeedCare
