import { meanBy } from 'lodash'
import { PageContext } from 'vike/types'
import { useTranslation } from 'react-i18next'
import useTemplateStore from '#stores/templateState.js'
import { FC, ReactNode, useEffect, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { STUDENT_NEED_CARE_PATH } from '#utils/constants/path.js'
import { useNavigateWithLoading } from '#hooks/useNavigateSider.js'
import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'
import { StudentCareComparisonData } from '#types/Data/StudentNeedCare.js'
import { LeftOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Space, Tabs, Tag, Typography, Progress, Row, Col } from 'antd'
import { useMergeStudentCareCompare } from '#hooks/studentCare/useMergeStudentCareCompare.js'
import { useStudentNeedCareDetailData } from '#hooks/api/studentNeedCare/useStudentNeedCareData.js'
import StudentCareToPdf from '#components/features/StudentNeedCare/StudentCareDetail/StudentCareToPdf.js'
import StudentCareRating from '#components/features/StudentNeedCare/StudentCareDetail/StudentCareRating.js'
import StudentCareHistory from '#components/features/StudentNeedCare/StudentCareDetail/StudentCareHistory.js'
import StudentCareNoteList from '#components/features/StudentNeedCare/StudentCareDetail/StudentCareNoteList.js'
import StudentCareProgress from '#components/features/StudentNeedCare/StudentCareDetail/StudentCareProgress.js'
import StudentCareComparison from '#components/features/StudentNeedCare/StudentCareDetail/StudentCareComparison.js'
import AddStudentCarePsychology from '#components/features/StudentNeedCare/StudentCareDetail/AddStudentCarePsychology.js'

const { Title } = Typography
const { TabPane } = Tabs

const StudentCareScreen: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('1')
  const [semesterNameList, setSemesterNameList] = useState<string[]>([])
  const { darkMode } = useTemplateStore()

  const { navigateWithLoading } = useNavigateWithLoading()
  const pageContext: PageContext = usePageContext()
  const id: string = pageContext.routeParams['id'] ?? ''

  const { data: semestersData } = useSemesterData()
  const { data: studentCareInfo } = useStudentNeedCareDetailData(id)

  // choose 3 semester as default to comparison
  useEffect(() => {
    if (semestersData) {
      setSemesterNameList(semestersData.slice(0, 3).map((semester) => semester.semesterName))
    }
  }, [semestersData])

  // merge student data with semesters
  const mergedStudentData: StudentCareComparisonData[] = useMergeStudentCareCompare(
    studentCareInfo?.studentCode,
    semesterNameList,
  )

  const handleAddSemester = () => {
    if (semestersData && semesterNameList && semesterNameList?.length < semestersData.length) {
      const nextSemester = semestersData[semesterNameList.length]
      if (nextSemester) {
        setSemesterNameList((prev) => [...prev, nextSemester.semesterName])
      }
    }
  }

  if (!studentCareInfo) return null

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header with back button and status dropdown */}
      <div
        className={`px-6 py-3 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center justify-between`}
      >
        <Button
          size='large'
          type='link'
          icon={<LeftOutlined />}
          onClick={async () =>
            await navigateWithLoading({
              path: `${STUDENT_NEED_CARE_PATH}`,
              loadingKey: 'student-need-care',
            })
          }
          className='text-blue-500 hover:text-blue-700'
        >
          {t('COMMON.BACK')}
        </Button>

        <div className='flex items-center'>
          <Tag
            color={studentCareInfo.careStatus === StudentCareStatus.Done ? 'success' : 'warning'}
            style={{ marginRight: '10px', padding: '4px 12px', fontSize: '14px' }}
          >
            {studentCareInfo.careStatus}
          </Tag>

          <AddStudentCarePsychology studentCode={studentCareInfo.student.studentCode} />
          <StudentCareNoteList />
        </div>
      </div>

      <div className='p-6'>
        <Row gutter={24}>
          {/* Left side - Student info */}
          <Col span={8}>
            <div
              className={`rounded-lg p-6 shadow-sm mb-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <Avatar size={100} icon={<UserOutlined />} className='mb-4' />
              <Title level={4} className={`mb-1 ${darkMode ? 'text-white' : ''}`}>
                {studentCareInfo.student.studentName}
              </Title>
              <div className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                <div>
                  {' '}
                  {t('COMMON.STUDENT_CODE')}: {studentCareInfo.student.studentCode}
                </div>
                <div>
                  {' '}
                  {t('COMMON.SPECIALIZED')}: {studentCareInfo.student.specialization}
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className='flex items-center mb-4'>
                <div className={`text-lg font-medium ${darkMode ? 'text-white' : ''}`}>
                  {t('STUDENT_NEED_CARE_DETAIL.OVERVIEW.TITLE')}
                </div>
                <Tag
                  className={`ml-auto px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-0'}`}
                >
                  {studentCareInfo.semesterName}
                </Tag>
              </div>

              {/* Student status information */}
              <div className='mb-4 grid grid-cols-2 gap-4'>
                <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('STUDENT_NEED_CARE_DETAIL.OVERVIEW.STATUS')}
                  </div>
                  <div className='font-medium'>
                    {studentCareInfo.student.progress || t('COMMON.NO_DATA')}
                  </div>
                </div>
                <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('STUDENT_NEED_CARE_DETAIL.OVERVIEW.CURRENT_SEMESTER')}
                  </div>
                  <div className='font-medium'>
                    Kỳ {studentCareInfo.student.currentTermNo || '-'}
                  </div>
                </div>
              </div>

              {/* Academic metrics */}
              <div className='mb-6'>
                <div className='flex justify-between mb-1'>
                  <div className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                    {t('STUDENT_NEED_CARE_DETAIL.OVERVIEW.GPA')}
                  </div>
                  <div
                    className={`font-medium ${
                      mergedStudentData.length > 0 &&
                      meanBy(
                        mergedStudentData[0]?.subjects.filter((s) => s.averageMark !== undefined),
                        'averageMark',
                      ) < 5
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}
                  >
                    {mergedStudentData.length > 0
                      ? meanBy(
                          mergedStudentData[0]?.subjects.filter((s) => s.averageMark !== undefined),
                          'averageMark',
                        )?.toFixed(2) || '0.00'
                      : '0.00'}
                  </div>
                </div>
                <Progress
                  percent={
                    mergedStudentData.length > 0
                      ? Math.min(
                          100,
                          (meanBy(
                            mergedStudentData[0]?.subjects.filter(
                              (s) => s.averageMark !== undefined,
                            ),
                            'averageMark',
                          ) || 0) * 10,
                        )
                      : 0
                  }
                  showInfo={false}
                  strokeColor={
                    mergedStudentData.length > 0 &&
                    meanBy(
                      mergedStudentData[0]?.subjects.filter((s) => s.averageMark !== undefined),
                      'averageMark',
                    ) < 5
                      ? '#f5222d'
                      : '#52c41a'
                  }
                  trailColor={darkMode ? '#303030' : '#f5f5f5'}
                  strokeWidth={8}
                />
              </div>

              <div>
                <div className='flex justify-between mb-1'>
                  <div className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                    {t('STUDENT_NEED_CARE_DETAIL.OVERVIEW.MEDIUM_ABSENCE')}
                  </div>
                  <div
                    className={`font-medium ${
                      // Find the current semester data instead of always using index 0
                      mergedStudentData
                        .find((data) => data.semesterName === studentCareInfo.semesterName)
                        ?.subjects.some((s) => s.absenceRate !== undefined) &&
                      meanBy(
                        mergedStudentData
                          .find((data) => data.semesterName === studentCareInfo.semesterName)
                          ?.subjects.filter((s) => s.absenceRate !== undefined),
                        'absenceRate',
                      ) > 20
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}
                  >
                    {mergedStudentData
                      .find((data) => data.semesterName === studentCareInfo.semesterName)
                      ?.subjects.some((s) => s.absenceRate !== undefined)
                      ? `${
                          meanBy(
                            mergedStudentData
                              .find((data) => data.semesterName === studentCareInfo.semesterName)
                              ?.subjects.filter((s) => s.absenceRate !== undefined),
                            'absenceRate',
                          )?.toFixed(2) || '0.00'
                        }%`
                      : '0.00%'}
                  </div>
                </div>
                <Progress
                  percent={
                    mergedStudentData
                      .find((data) => data.semesterName === studentCareInfo.semesterName)
                      ?.subjects.some((s) => s.absenceRate !== undefined)
                      ? meanBy(
                          mergedStudentData
                            .find((data) => data.semesterName === studentCareInfo.semesterName)
                            ?.subjects.filter((s) => s.absenceRate !== undefined),
                          'absenceRate',
                        ) || 0
                      : 0
                  }
                  showInfo={false}
                  strokeColor={
                    mergedStudentData
                      .find((data) => data.semesterName === studentCareInfo.semesterName)
                      ?.subjects.some((s) => s.absenceRate !== undefined) &&
                    meanBy(
                      mergedStudentData
                        .find((data) => data.semesterName === studentCareInfo.semesterName)
                        ?.subjects.filter((s) => s.absenceRate !== undefined),
                      'absenceRate',
                    ) > 20
                      ? '#f5222d'
                      : '#52c41a'
                  }
                  trailColor={darkMode ? '#303030' : '#f5f5f5'}
                  strokeWidth={8}
                />
              </div>
            </div>
          </Col>

          {/* Right side - Tabs */}
          <Col span={16}>
            <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Tab navigation */}
              <div className={`border-b px-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <Tabs
                  activeKey={activeTab}
                  onChange={(key: string) => setActiveTab(key)}
                  className={`custom-tabs ${darkMode ? 'dark-tabs' : ''}`}
                  tabBarExtraContent={{
                    right: (
                      <Space>
                        {activeTab === '1' && (
                          <>
                            <StudentCareToPdf
                              studentName={studentCareInfo.student.studentName}
                              mergedStudentData={mergedStudentData}
                            />
                            <Button
                              type='primary'
                              onClick={handleAddSemester}
                              icon={<PlusOutlined />}
                            >
                              {t('STUDENT_NEED_CARE_DETAIL.TAB.NEW_SEMESTER')}
                            </Button>
                          </>
                        )}
                      </Space>
                    ),
                  }}
                >
                  <TabPane key='1' tab={t('STUDENT_NEED_CARE_DETAIL.TAB.TITLE.FIRST_TAB')}>
                    <StudentCareComparison
                      semesterList={semesterNameList}
                      studentCode={studentCareInfo.studentCode}
                    />
                  </TabPane>
                  <TabPane key='2' tab={t('STUDENT_NEED_CARE_DETAIL.TAB.TITLE.SECOND_TAB')}>
                    <div className='p-6'>
                      <StudentCareRating studentCareData={studentCareInfo} />
                    </div>
                  </TabPane>
                  <TabPane key='3' tab={t('STUDENT_NEED_CARE_DETAIL.TAB.TITLE.THIRD_TAB')}>
                    <div className='p-6'>
                      <StudentCareHistory studentId={studentCareInfo.studentCode} />
                    </div>
                  </TabPane>
                  <TabPane key='4' tab={t('STUDENT_NEED_CARE_DETAIL.TAB.TITLE.FOURTH_TAB')}>
                    <div className='p-6'>
                      <StudentCareProgress studentCareId={id} />
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default StudentCareScreen
