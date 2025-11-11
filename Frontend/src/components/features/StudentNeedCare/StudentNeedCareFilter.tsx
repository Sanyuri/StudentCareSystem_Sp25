import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useMemo, useState } from 'react'
import { Button, Col, Drawer, Input, Row, Select } from 'antd'
import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'
import { StudentNeedCareFilterRequest } from '#types/RequestModel/StudentNeedCareRequest.js'
interface StudentNeedCareFilterProps {
  open: boolean
  onClose(): void
  onFilterChange: (updatedFilter: StudentNeedCareFilterRequest) => void
}

const StudentNeedCareFilter: FC<StudentNeedCareFilterProps> = ({
  open,
  onClose,
  onFilterChange,
}: StudentNeedCareFilterProps): ReactNode => {
  const { t } = useTranslation()
  const [filterState, setFilterState] = useState<StudentNeedCareFilterRequest>({
    rank: undefined,
    isCollaborating: undefined,
    isProgressing: undefined,
    needsCareNextTerm: undefined,
    careStatus: undefined,
    userId: undefined,
    semesterName: undefined,
  })

  const handleChange = (key: keyof StudentNeedCareFilterRequest, value: unknown): void => {
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleFilterSubmit = (): void => {
    onFilterChange(filterState)
  }

  const handleReset = (): void => {
    // Reset to the initial state
    const resetState: StudentNeedCareFilterRequest = {
      rank: undefined,
      isCollaborating: undefined,
      isProgressing: undefined,
      needsCareNextTerm: undefined,
      careStatus: undefined,
      userId: undefined,
      semesterName: undefined,
    }

    setFilterState(resetState) // Reset the filter state
    onFilterChange(resetState) // Call the parent function with the reset state
  }
  const needsCareValue = useMemo(() => {
    if (filterState.needsCareNextTerm === undefined) return undefined
    return filterState.needsCareNextTerm ? 1 : 0
  }, [filterState.needsCareNextTerm])

  const isCollaboratingValue = useMemo(() => {
    if (filterState.isCollaborating === undefined) return undefined
    return filterState.isCollaborating ? 1 : 0
  }, [filterState.isCollaborating])

  const isProgressingValue = useMemo(() => {
    if (filterState.isProgressing === undefined) return undefined
    return filterState.isProgressing ? 1 : 0
  }, [filterState.isProgressing])

  const isCollaboratingOptions: { value: number; label: string }[] = [
    {
      value: 1,
      label: t('STUDENT_NEED_CARE.FILTER.COLLABORATOR_OPTION.APPROVE'),
    },
    {
      value: 0,
      label: t('STUDENT_NEED_CARE.FILTER.COLLABORATOR_OPTION.REJECT'),
    },
  ]

  const isProgressingOptions: { value: number; label: string }[] = [
    {
      value: 1,
      label: t('STUDENT_NEED_CARE.FILTER.IS_PROGRESSING_OPTION.PROGRESSING'),
    },
    {
      value: 0,
      label: t('STUDENT_NEED_CARE.FILTER.IS_PROGRESSING_OPTION.NOT_PROGRESSING'),
    },
  ]

  const needsCareNextTermOptions: { value: number; label: string }[] = [
    {
      value: 1,
      label: t('STUDENT_NEED_CARE.FILTER.NEED_CARE_NEXT_OPTION.NEED_CARE'),
    },
    {
      value: 0,
      label: t('STUDENT_NEED_CARE.FILTER.NEED_CARE_NEXT_OPTION.NOT_NEED_CARE'),
    },
  ]
  const careStatusOptions: { value: StudentCareStatus; label: string }[] = [
    {
      value: StudentCareStatus.Done,
      label: t('STUDENT_NEED_CARE.FILTER.CARE_STATUS_OPTION.COMPLETE'),
    },
    {
      value: StudentCareStatus.Doing,
      label: t('STUDENT_NEED_CARE.FILTER.CARE_STATUS_OPTION.DOING'),
    },
    {
      value: StudentCareStatus.Todo,
      label: t('STUDENT_NEED_CARE.FILTER.CARE_STATUS_OPTION.TO_DO'),
    },
    {
      value: StudentCareStatus.NotAssigned,
      label: t('STUDENT_NEED_CARE.FILTER.CARE_STATUS_OPTION.NOT_ASSIGN'),
    },
  ]

  return (
    <Drawer title={t('COMMON.FILTER')} placement='right' onClose={onClose} open={open} width={400}>
      <div className='space-y-4'>
        {/* Ranking filter */}
        <div>
          <label htmlFor={'rank'} className='block mb-1 text-sm font-medium'>
            {t('STUDENT_NEED_CARE.FILTER.LABEL.RANKING')}
          </label>
          <Input
            placeholder={t('STUDENT_NEED_CARE.FILTER.LABEL.RANKING')}
            value={filterState.rank ?? ''} // Use filterState instead of filter
            onChange={(e): void => handleChange('rank', e.target.value)}
          />
        </div>
        {/* Progressing checking */}
        <div>
          <label htmlFor={'isProgressing'} className='block mb-1 text-sm font-medium'>
            {t('STUDENT_NEED_CARE.FILTER.LABEL.IS_PROGRESSING')}
          </label>
          <Select
            placeholder={t('STUDENT_NEED_CARE.FILTER.LABEL.IS_PROGRESSING')}
            style={{ width: '100%' }}
            options={isProgressingOptions}
            value={isProgressingValue}
            onChange={(value: number): void => handleChange('isProgressing', value === 1)}
          />
        </div>
        {/* Collaborating checking */}
        <div>
          <label htmlFor={'isCollaborating'} className='block mb-1 text-sm font-medium'>
            {t('STUDENT_NEED_CARE.FILTER.LABEL.IS_COLLABORATING')}
          </label>
          <Select
            placeholder={t('STUDENT_NEED_CARE.FILTER.LABEL.IS_COLLABORATING')}
            style={{ width: '100%' }}
            options={isCollaboratingOptions}
            value={isCollaboratingValue}
            onChange={(value: number): void => handleChange('isCollaborating', value === 1)}
          />
        </div>
        {/* NeedsCareNextTerm checking */}
        <div>
          <label htmlFor={'needsCareNextTerm'} className='block mb-1 text-sm font-medium'>
            {t('STUDENT_NEED_CARE.FILTER.LABEL.NEED_CARE_NEXT')}
          </label>
          <Select
            placeholder={t('STUDENT_NEED_CARE.FILTER.LABEL.NEED_CARE_NEXT')}
            style={{ width: '100%' }}
            options={needsCareNextTermOptions}
            value={needsCareValue}
            onChange={(value: number): void => handleChange('needsCareNextTerm', value === 1)}
          />
        </div>

        {/* CareStatus checking */}
        <div>
          <label htmlFor={'careStatus'} className='block mb-1 text-sm font-medium'>
            {t('STUDENT_NEED_CARE.FILTER.LABEL.CARE_STATUS')}
          </label>
          <Select
            placeholder={t('STUDENT_NEED_CARE.FILTER.LABEL.CARE_STATUS')}
            style={{ width: '100%' }}
            options={careStatusOptions}
            onChange={(value: number): void => handleChange('careStatus', value)}
          />
        </div>

        <Row justify='space-between' gutter={8}>
          <Col>
            <Button danger size='large' style={{ width: '120px' }} onClick={handleReset}>
              {t('COMMON.RESET_ACTION')}
            </Button>
          </Col>
          <Col>
            <Button
              type='primary'
              size='large'
              onClick={handleFilterSubmit}
              style={{ width: '120px' }}
            >
              {t('COMMON.FILTER_ACTION')}
            </Button>
          </Col>
        </Row>
      </div>
    </Drawer>
  )
}

export default StudentNeedCareFilter
