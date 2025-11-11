import { meanBy } from 'lodash'
import { FC, ReactNode } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { useTranslation } from 'react-i18next'
import { HistoryOutlined } from '@ant-design/icons'
import { ColumnProps } from 'antd/es/table/index.js'
import { Card, Col, Row, Statistic, Table, Tag } from 'antd'
import { useMergeStudentCareCompare } from '#hooks/studentCare/useMergeStudentCareCompare.js'
import {
  StudentCareComparisonData,
  SubjectStudentCareComparisonData,
} from '#types/Data/StudentNeedCare.js'

pdfMake.vfs = pdfFonts.vfs

interface StudentCareComparisonProps {
  studentCode: string
  semesterList: string[]
}

const StudentCareComparison: FC<StudentCareComparisonProps> = ({
  studentCode,
  semesterList,
}: StudentCareComparisonProps): ReactNode => {
  const { t } = useTranslation()
  const mergedStudentData: StudentCareComparisonData[] = useMergeStudentCareCompare(
    studentCode,
    semesterList,
  )

  const courseColumns: ColumnProps<SubjectStudentCareComparisonData>[] = [
    {
      title: t('STUDENT_NEED_CARE_DETAIL.COMPARISON.TABLE.SUBJECT_CODE'),
      align: 'left',
      dataIndex: 'subjects.subjectCode',
      key: 'subjects.subjectCode',
      render: (__: unknown, record: SubjectStudentCareComparisonData) => (
        <span>{record.subjectCode}</span>
      ),
    },
    {
      title: t('STUDENT_NEED_CARE_DETAIL.COMPARISON.TABLE.MARK'),
      align: 'center',
      dataIndex: 'averageMark',
      key: 'averageMark',
      render: (__: unknown, record: SubjectStudentCareComparisonData) => (
        <span
          className={
            record.averageMark !== undefined && record.averageMark < 5
              ? 'text-red-500'
              : 'text-green-500'
          }
        >
          {record.averageMark ?? '-'}
        </span>
      ),
    },
    {
      title: t('STUDENT_NEED_CARE_DETAIL.COMPARISON.TABLE.ABSENCE_RATE'),
      dataIndex: 'absenceRate',
      key: 'absenceRate',
      align: 'center',
      render: (__: unknown, record: SubjectStudentCareComparisonData) => (
        <span
          className={
            record.absenceRate !== undefined && record.absenceRate > 20
              ? 'text-red-500'
              : 'text-green-500'
          }
        >
          {record.absenceRate ?? '-'}
        </span>
      ),
    },
  ]

  return (
    <Row gutter={[24, 24]} style={{ display: 'flex', alignItems: 'stretch' }}>
      {mergedStudentData.map((studentRecord) => (
        <Col key={studentRecord.semesterName} xs={24} sm={12} md={12} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <HistoryOutlined style={{ marginRight: '8px' }} />
                <span>{t('STUDENT_NEED_CARE_DETAIL.COMPARISON.PARAMETER')}</span>
              </div>
            }
            style={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
            extra={<Tag color='blue'>{studentRecord.semesterName}</Tag>}
          >
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={8}>
                <Statistic
                  title={t('STUDENT_NEED_CARE_DETAIL.OVERVIEW.GPA')}
                  valueStyle={{
                    color:
                      (meanBy(
                        studentRecord.subjects.filter((s) => s.averageMark && s.averageMark > 0),
                        'averageMark',
                      ) || 0) >= 5
                        ? 'green'
                        : 'red',
                  }}
                  value={
                    meanBy(
                      studentRecord.subjects.filter((s) => s.averageMark && s.averageMark > 0),
                      'averageMark',
                    ) || 0
                  }
                  precision={2}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={t('STUDENT_NEED_CARE_DETAIL.OVERVIEW.MEDIUM_ABSENCE')}
                  valueStyle={{
                    color:
                      (meanBy(
                        studentRecord.subjects.filter((s) => s.absenceRate && s.absenceRate > 0),
                        'absenceRate',
                      ) || 0) >= 50
                        ? 'red'
                        : 'green',
                  }}
                  value={
                    studentRecord.subjects.some((s) => s.absenceRate && s.absenceRate > 0)
                      ? `${meanBy(
                          studentRecord.subjects.filter((s) => s.absenceRate && s.absenceRate > 0),
                          'absenceRate',
                        )?.toFixed(2)}%`
                      : '0%'
                  }
                />
              </Col>
            </Row>
            <Table
              dataSource={studentRecord.subjects}
              columns={courseColumns}
              pagination={false}
              size='small'
            />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default StudentCareComparison
