import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { AuditOutlined } from '@ant-design/icons'
import { FC, ReactNode, useEffect, useState } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Card, Row, Col, Radio, Progress, Typography, Space, Button } from 'antd'
import { useProgressCriteriaData } from '#hooks/api/progressCriteria/useProgressCriteriaData.js'
import { useProgressCriterionTypeData } from '#hooks/api/progressCriterionType/useProgressCriterionTypeData.js'
import { useUpdateAllProgressCriteriaMutation } from '#hooks/api/progressCriteria/useProgressCriteriaMutation.js'
import {
  UpdateParamProgressCriteriaRequest,
  UpdateProgressCriteriaRequest,
} from '#src/types/RequestModel/ProgressCriteriaRequest.js'
import useTemplateStore from '#stores/templateState.js'

const { Text, Title } = Typography

interface StudentCareProgressProps {
  studentCareId: string
  canEdit?: boolean
}

const StudentCareProgress: FC<StudentCareProgressProps> = ({
  studentCareId,
  canEdit = true,
}): ReactNode => {
  const { t, i18n } = useTranslation()
  const { darkMode } = useTemplateStore()
  const { data: criteriaTypes } = useProgressCriterionTypeData()
  const { data: criteriaData } = useProgressCriteriaData(studentCareId)
  const { mutate: updateAllProgressCriteria } = useUpdateAllProgressCriteriaMutation()
  const [evaluations, setEvaluations] = useState<UpdateProgressCriteriaRequest[]>([])

  useEffect(() => {
    if (criteriaData?.length) {
      setEvaluations(
        criteriaData.map((criteria) => ({
          id: criteria.id,
          score: criteria.score,
          studentNeedCareId: studentCareId,
          progressCriterionTypeId: criteria.progressCriterionTypeId,
        })),
      )
    }
  }, [criteriaData, criteriaTypes, studentCareId])

  const handleScoreChange = (criterionId: string, score: number) => {
    setEvaluations((prev: UpdateProgressCriteriaRequest[]) => {
      // Find existing evaluation by progressCriterionTypeId
      const existing = prev.find((e) => e.progressCriterionTypeId === criterionId)

      if (existing) {
        return prev.map((e) => (e.id === existing.id ? { ...e, score } : e))
      }

      return [
        ...prev,
        {
          score,
          studentNeedCareId: studentCareId,
          progressCriterionTypeId: criterionId,
        },
      ]
    })
  }

  const calculateProgress = (criterionId: string): number => {
    // Find evaluation by progressCriterionTypeId
    const evaluation = evaluations.find((e) => e.progressCriterionTypeId === criterionId)
    return evaluation ? evaluation.score * 20 : 0 // Convert 1-5 score to percentage
  }

  const handleSaveEvaluations = () => {
    const updateData: UpdateParamProgressCriteriaRequest = {
      studentNeedCareId: studentCareId,
      body: evaluations,
    }
    if (evaluations.length > 0) {
      updateAllProgressCriteria(updateData)
    }
  }

  return (
    <Card
      title={
        <div className='flex items-center space-x-2'>
          <AuditOutlined className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
          <span className={`text-lg font-semibold ${darkMode ? 'text-white' : ''}`}>
            {t('STUDENT_NEED_CARE_DETAIL.CARE_PROGRESS.TITLE')}
          </span>
        </div>
      }
      className={`shadow-md ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
    >
      <div className='space-y-6'>
        <Row gutter={[24, 24]}>
          {criteriaTypes?.map((criterion) => (
            <Col key={criterion.id} xs={24} md={12}>
              <Card
                className={`${darkMode ? 'bg-gray-700 hover:shadow-md transition-shadow' : 'bg-gray-50 hover:shadow-md transition-shadow'}`}
                variant={'borderless'}
              >
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                      <Title level={5} className={`!mb-0 ${darkMode ? 'text-gray-200' : ''}`}>
                        {i18n.language === 'en' ? criterion.englishName : criterion.vietnameseName}
                      </Title>
                      <Tooltip
                        title={
                          i18n.language === 'en'
                            ? criterion.englishDescription
                            : criterion.vietnameseDescription
                        }
                      >
                        <QuestionCircleOutlined
                          className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'} cursor-pointer`}
                        />
                      </Tooltip>
                    </div>
                    <Text
                      className={
                        calculateProgress(criterion.id) >= 60
                          ? darkMode
                            ? 'text-green-400'
                            : 'text-green-500'
                          : darkMode
                            ? 'text-red-400'
                            : 'text-red-500'
                      }
                    >
                      {calculateProgress(criterion.id)}%
                    </Text>
                  </div>

                  <Progress
                    percent={calculateProgress(criterion.id)}
                    showInfo={false}
                    strokeColor={calculateProgress(criterion.id) >= 60 ? '#52c41a' : '#f5222d'}
                    trailColor={darkMode ? '#4B5563' : undefined}
                  />

                  <Radio.Group
                    className='w-full grid grid-cols-5 gap-2'
                    value={
                      evaluations.find((e) => e.progressCriterionTypeId === criterion.id)?.score ??
                      0
                    }
                    onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Radio.Button
                        key={score}
                        value={score}
                        className={`text-center ${
                          evaluations.find((e) => e.progressCriterionTypeId === criterion.id)
                            ?.score === score
                            ? darkMode
                              ? 'bg-blue-700 text-white'
                              : 'bg-blue-300'
                            : darkMode
                              ? 'bg-gray-600 text-gray-200 border-gray-500'
                              : ''
                        }`}
                      >
                        {score}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div
          className={`flex justify-between items-center pt-4 border-t ${darkMode ? 'border-gray-700' : ''}`}
        >
          <Space>
            <Text className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
              {t('STUDENT_NEED_CARE_DETAIL.CARE_PROGRESS.TOTAL_CRITERION')}
              {evaluations.length}/{criteriaTypes?.length ?? 0}
            </Text>
          </Space>
          {canEdit && (
            <Space>
              <Button
                size='large'
                className={
                  darkMode ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600' : ''
                }
              >
                {t('COMMON.RESET_ACTION')}
              </Button>
              <Button
                type='primary'
                size='large'
                className='bg-blue-500'
                onClick={handleSaveEvaluations}
                disabled={evaluations.length === 0}
              >
                {t('COMMON.SAVE')}
              </Button>
            </Space>
          )}
        </div>
      </div>
    </Card>
  )
}

export default StudentCareProgress
