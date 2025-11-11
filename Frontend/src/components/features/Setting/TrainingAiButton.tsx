import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { useAnalyzeStudentNeedCareMutation } from '#hooks/api/studentNeedCare/useStudentNeedCareMutation.js'
import { Semester } from '#src/types/Data/Semester.js'
import { Button, Col, Select, Typography } from 'antd'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const { Title } = Typography
const { Option } = Select

const TrainingAiButton: FC = () => {
  const { t } = useTranslation()
  const [semesterName, setSemesterName] = useState<string | undefined>()
  const { mutate: handleAnalyze } = useAnalyzeStudentNeedCareMutation()

  const { data: semesters } = useSemesterData()
  const handleTrigger = () => {
    if (!semesterName) {
      toast.error(t('COMMON.NEED_SEMESTER'))
      return
    }
    handleAnalyze({ semesterName: semesterName })
  }
  return (
    <Col span={12}>
      <Title level={5} className='mb-2'>
        {t('SETTINGS.ANALYZE')}
      </Title>
      <Select
        placeholder={t('COMMON.CHOOSE_SEMESTER')}
        style={{ width: 200 }}
        onChange={(value: string) => setSemesterName(value)}
      >
        {semesters?.map((semester: Semester) => (
          <Option key={semester.id} value={semester.semesterName}>
            {semester.semesterName}
          </Option>
        ))}
      </Select>
      <Button type='primary' onClick={handleTrigger} className={'ml-0 md:ml-4 mt-2'}>
        {t('COMMON.SCAN')}
      </Button>
    </Col>
  )
}

export default TrainingAiButton
