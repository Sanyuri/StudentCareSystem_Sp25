import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import { StudentProgress } from '#types/Enums/StudentProgress.js'
import { StudentFilter } from '#types/RequestModel/AttendanceRequest.js'
import { Button, Col, Drawer, Input, InputNumber, Row, Select } from 'antd'

interface TableStudentFailedCourseProps {
  open: boolean

  onClose(): void

  onFilterChange: (updatedFilter: StudentFilter) => void
}

const StudentFilterComponent: FC<TableStudentFailedCourseProps> = ({
  open,
  onClose,
  onFilterChange,
}: TableStudentFailedCourseProps): ReactNode => {
  const { t } = useTranslation()
  const [filterState, setFilterState] = useState<StudentFilter>({
    studentClass: undefined,
    major: undefined,
    statusCode: undefined,
    currentTermNo: undefined,
  })

  const handleChange = (key: keyof StudentFilter, value: unknown): void => {
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
    const resetState: StudentFilter = {
      studentClass: undefined,
      major: undefined,
      statusCode: undefined,
      currentTermNo: undefined,
    }

    setFilterState(resetState) // Reset the filter state
    onFilterChange(resetState) // Call the parent function with the reset state
  }

  return (
    <Drawer title={t('COMMON.FILTER')} placement='right' onClose={onClose} open={open} width={400}>
      <div className='space-y-4'>
        <div>
          <label htmlFor='student-class' className='block mb-1 text-sm font-medium'>
            {t('ATTENDANCES.FILTER.CLASS')}
          </label>
          <Input
            id='student-class' // Liên kết với label qua htmlFor
            placeholder={t('COMMON.CLASS_HINT')}
            value={filterState.studentClass ?? ''} // Use filterState instead of filter
            onChange={(e) => handleChange('studentClass', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor='major' className='block mb-1 text-sm font-medium'>
            {t('STUDENTS.FILTER.MAJOR')}
          </label>
          <Input
            id='major' // Liên kết với label qua htmlFor
            placeholder={t('STUDENTS.FILTER.MAJOR_HINT')}
            value={filterState.major ?? ''} // Use filterState instead of filter
            onChange={(e) => handleChange('major', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor='status-code' className='block mb-1 text-sm font-medium'>
            {t('STUDENTS.FILTER.PROGRESS')}
          </label>
          <Select
            id='status-code'
            placeholder={t('STUDENTS.FILTER.PROGRESS_SEARCH')}
            value={filterState.statusCode ?? undefined} // Sử dụng undefined nếu không có giá trị
            onChange={(value) => handleChange('statusCode', value)} // Gọi hàm handleChange với giá trị mới
            style={{ width: '100%' }} // Để Select chiếm toàn bộ chiều rộng
          >
            {Object.keys(StudentProgress).map((key) => (
              <Select.Option key={key} value={key}>
                {t(StudentProgress[key as keyof typeof StudentProgress])}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor='current-term-no' className='block mb-1 text-sm font-medium'>
            {t('STUDENTS.FILTER.SEMESTER')}
          </label>
          <InputNumber
            id='current-term-no'
            style={{ width: '100%' }}
            className='w-full'
            placeholder={t('STUDENTS.FILTER.SEMESTER_SEARCH')}
            value={filterState.currentTermNo ?? ''} // Use filterState instead of filter
            onChange={(value) =>
              handleChange('currentTermNo', value !== undefined ? value : undefined)
            }
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

export default StudentFilterComponent
