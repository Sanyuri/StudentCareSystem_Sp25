import { Dispatch, FC, Fragment, ReactNode, SetStateAction } from 'react'
import CareOfficerDistributionModal from './CareOfficerDistributionModal'
import { Col, Row, Select } from 'antd'
import { useStudentNeedCareStatusCount } from '#hooks/api/studentNeedCare/useStudentNeedCareData.js'
import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { Semester } from '#src/types/Data/Semester.js'
import StatisticCardStudentCare from './StatisticCardStudentCare'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

interface StatisticStudentCareProps {
  semester: string | undefined
  setSemester: Dispatch<SetStateAction<string | undefined>>
}

const StatisticStudentCare: FC<StatisticStudentCareProps> = ({
  semester,
  setSemester,
}: StatisticStudentCareProps): ReactNode => {
  const { t } = useTranslation()

  const { data: statisticStatusCount } = useStudentNeedCareStatusCount(semester)
  const { data: semesterData } = useSemesterData()

  return (
    <Fragment>
      <div className='flex justify-between items-center px-6'>
        <h2 className='text-xl font-semibold'>
          {t('STUDENT_NEED_CARE.DASHBOARD.STATISTICS.TITLE')}
        </h2>
        <div>
          <CareOfficerDistributionModal semesterName={semester} />
          <Select
            size={'large'}
            style={{ width: 200 }}
            value={semester}
            onChange={(value: string): void => setSemester(value)}
          >
            {semesterData?.map((semester: Semester) => (
              <Select.Option key={semester.id} value={semester.semesterName}>
                {semester.semesterName}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className={'px-6 pb-0'}>
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={4} xs={24} sm={12} md={8} lg={6} xl={4}>
            <StatisticCardStudentCare
              icon={<UserOutlined style={{ fontSize: '16px', color: '#1890ff' }} />}
              title={t('STUDENT_NEED_CARE.DASHBOARD.STATISTICS.TOTAL_STUDENT')}
              value={
                (statisticStatusCount?.Doing ?? 0) +
                (statisticStatusCount?.Todo ?? 0) +
                (statisticStatusCount?.Done ?? 0) +
                (statisticStatusCount?.NotAssigned ?? 0)
              }
            />
          </Col>
          <Col span={5} xs={24} sm={12} md={8} lg={6} xl={5}>
            <StatisticCardStudentCare
              icon={<QuestionCircleOutlined style={{ fontSize: '16px', color: '#faad14' }} />}
              title={t('STUDENT_NEED_CARE.DASHBOARD.STATISTICS.NOT_ASSIGNED')}
              value={statisticStatusCount?.NotAssigned ?? 0}
            />
          </Col>
          <Col span={5} xs={24} sm={12} md={8} lg={6} xl={5}>
            <StatisticCardStudentCare
              icon={<ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />}
              title={t('STUDENT_NEED_CARE.DASHBOARD.STATISTICS.CURRENT_CARE')}
              value={statisticStatusCount?.Doing ?? 0}
            />
          </Col>
          <Col span={5} xs={24} sm={12} md={8} lg={6} xl={5}>
            <StatisticCardStudentCare
              icon={<QuestionCircleOutlined style={{ fontSize: '16px', color: '#faad14' }} />}
              title={t('STUDENT_NEED_CARE.DASHBOARD.STATISTICS.NOT_CARE')}
              value={statisticStatusCount?.Todo ?? 0}
            />
          </Col>
          <Col span={5} xs={24} sm={12} md={8} lg={6} xl={5}>
            <StatisticCardStudentCare
              icon={<CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />}
              title={t('STUDENT_NEED_CARE.DASHBOARD.STATISTICS.COMPLETED_CARE')}
              value={statisticStatusCount?.Done ?? 0}
            />
          </Col>
        </Row>
      </div>
    </Fragment>
  )
}

export default StatisticStudentCare
