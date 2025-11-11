import { FC, Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnProps } from 'antd/es/table/index.js'
import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'
import { CurrentUserResponse } from '#types/ResponseModel/ApiResponse.js'
import { Modal, Card, Avatar, Progress, Button, Divider, Table, Badge } from 'antd'
import { UserOutlined, BarChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { StudentCareAssignmentStatusCount } from '#types/Data/StudentCareAssignment.js'
import { useStudentCareAssignmentData } from '#hooks/api/studentCareAssignment/useStudentCareAssignmentData.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'

interface CareOfficerDistributionModalProps {
  semesterName: string | undefined
}

const CareOfficerDistributionModal: FC<CareOfficerDistributionModalProps> = ({
  semesterName,
}: CareOfficerDistributionModalProps) => {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [officerDistributionVisible, setOfficerDistributionVisible] = useState(false)

  const { hasPermission } = useCheckPermission()

  const hasReadPermission = hasPermission(PermissionType.ReadStudentCareAssignment)

  const { data: careOfficers } = useStudentCareAssignmentData(
    semesterName,
    semesterName !== undefined,
  )

  const totalStudents: number | undefined = careOfficers?.reduce((totalSum: number, item) => {
    const careSum: number = Object.values(item.careStatusCount).reduce(
      (sum: number, count: number) => sum + count,
      0,
    )
    return totalSum + careSum
  }, 0)

  const handleCancel = () => {
    setOfficerDistributionVisible(false)
  }
  const columns: ColumnProps<StudentCareAssignmentStatusCount>[] = [
    {
      title: t('STUDENT_NEED_CARE.DISTRIBUTE.TABLE.OFFICER'),
      dataIndex: 'user',
      key: 'user',
      render: (text: CurrentUserResponse) => (
        <div className='flex items-center'>
          <Avatar icon={<UserOutlined />} className='mr-2' />
          <span>{text.fullName}</span>
        </div>
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.DISTRIBUTE.TABLE.NEED_CARE'),
      dataIndex: 'careStatusCount',
      key: 'careStatusCount',
      render: (careStatusCount: Record<StudentCareStatus, number>) => (
        <Badge
          showZero
          overflowCount={Infinity}
          count={careStatusCount.Todo ?? 0}
          className='site-badge-count-109'
          style={{ backgroundColor: '#3b82f6' }}
        />
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.DISTRIBUTE.TABLE.NEED_CARE_DONE'),
      dataIndex: 'careStatusCount',
      key: 'careStatusCount',
      render: (careStatusCount: Record<StudentCareStatus, number>) => (
        <Badge
          showZero
          overflowCount={Infinity}
          count={careStatusCount.Done ?? 0}
          className='site-badge-count-109'
          style={{ backgroundColor: '#3b82f6' }}
        />
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.DISTRIBUTE.TABLE.NEED_CARE_DOING'),
      dataIndex: 'careStatusCount',
      key: 'careStatusCount',
      render: (careStatusCount: Record<StudentCareStatus, number>) => (
        <Badge
          showZero
          overflowCount={Infinity}
          count={careStatusCount.Done ?? 0}
          className='site-badge-count-109'
          style={{ backgroundColor: '#3b82f6' }}
        />
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.DISTRIBUTE.TABLE.PROGRESSING'),
      dataIndex: 'careStatusCount',
      key: 'capacity',
      render: (record: Record<StudentCareStatus, number>) => {
        const total: number =
          (Number(record.Todo) || 0) + (Number(record.Doing) || 0) + (Number(record.Done) || 0)
        const percent: number = Math.round(((record.Done ?? 0) / total) * 100)
        let strokeColor: string = '#f5222d'
        if (percent > 90) {
          strokeColor = '#52c41a'
        } else if (percent > 40) {
          strokeColor = '#faad14'
        }

        return (
          <div className='w-full'>
            <div className='flex justify-between mb-1'>
              <span>
                {record.Done ?? 0}/{total}
              </span>
              <span>{percent}%</span>
            </div>
            <Progress percent={percent} size='small' strokeColor={strokeColor} showInfo={false} />
          </div>
        )
      },
    },
  ]

  if (!careOfficers || !hasReadPermission) {
    return null
  }

  const calculateStats = (officer: StudentCareAssignmentStatusCount) => {
    const { Todo = 0, Doing = 0, Done = 0 } = officer?.careStatusCount || {}

    const capacity = Todo + Doing + Done

    return {
      studentCount: Done,
      capacity,
      load: capacity > 0 ? Done / capacity : 0,
    }
  }

  let maxOfficer = null
  let minOfficer = null
  let maxLoad = 0
  let minLoad = 0

  if (careOfficers && careOfficers.length > 0) {
    maxOfficer = careOfficers.reduce(
      (max, officer) => (calculateStats(officer).load > calculateStats(max).load ? officer : max),
      careOfficers[0],
    )

    minOfficer = careOfficers.reduce(
      (min, officer) => (calculateStats(officer).load < calculateStats(min).load ? officer : min),
      careOfficers[0],
    )

    maxLoad = Math.round(calculateStats(maxOfficer).load * 100)
    minLoad = Math.round(calculateStats(minOfficer).load * 100)
  }

  return (
    <Fragment>
      <Button
        type='link'
        size={'large'}
        icon={<BarChartOutlined className='text-xl' />}
        onClick={() => setOfficerDistributionVisible(true)}
      >
        {t('STUDENT_NEED_CARE.DISTRIBUTE.BUTTON')}
      </Button>

      <Modal
        centered
        closable={false}
        title={
          <div className='flex items-center justify-between'>
            <span className='text-lg font-medium'>{t('STUDENT_NEED_CARE.DISTRIBUTE.TITLE')}</span>
            <div className='flex gap-2'>
              <Button
                type={viewMode === 'cards' ? 'primary' : 'default'}
                onClick={() => setViewMode('cards')}
                className={viewMode === 'cards' ? 'bg-blue-500' : ''}
              >
                {t('STUDENT_NEED_CARE.DISTRIBUTE.CARD_MODE')}
              </Button>
              <Button
                type={viewMode === 'table' ? 'primary' : 'default'}
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-blue-500' : ''}
              >
                {t('STUDENT_NEED_CARE.DISTRIBUTE.TABLE_MODE')}
              </Button>
            </div>
          </div>
        }
        open={officerDistributionVisible}
        width={900}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleCancel}>
            {t('COMMON.BACK')}
          </Button>,
        ]}
      >
        <div className={'max-h-[70vh] overflow-y-scroll'}>
          <div className='mb-6 bg-blue-50 p-4 border border-blue-100'>
            <div className='flex items-center'>
              <InfoCircleOutlined className='text-blue-500 mr-2 text-lg' />
              <div>
                <div className='font-medium'>
                  {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.TITLE')}
                </div>
                <div className='text-gray-500'>
                  {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.TOTAL_STUDENT')}
                  <span className='font-medium'>{totalStudents}</span> |{' '}
                  {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.TOTAL_STUDENT')}
                  <span className='font-medium'>{careOfficers.length}</span> |{' '}
                  {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.MEDIUM')}
                  <span className='font-medium'>
                    {Math.round((totalStudents ?? 0) / careOfficers.length)}{' '}
                    {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.STUDENT_PER_OFFICER')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'cards' ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {careOfficers?.map((officer: StudentCareAssignmentStatusCount) => {
                const totalStudents =
                  (officer.careStatusCount.Todo ?? 0) +
                  (officer.careStatusCount.Doing ?? 0) +
                  (officer.careStatusCount.Done ?? 0)
                const workloadPercent = Math.round(
                  ((officer.careStatusCount.Done ?? 0) / totalStudents) * 100,
                )

                let strokeColor = '#52c41a'
                if (workloadPercent > 90) strokeColor = '#f5222d'
                else if (workloadPercent > 70) strokeColor = '#faad14'

                return (
                  <Card
                    key={officer.user.id}
                    className='hover:shadow-md transition-shadow'
                    styles={{ body: { padding: '16px' } }}
                  >
                    <div className='flex items-center mb-3'>
                      <Avatar size={48} icon={<UserOutlined />} className='mr-3' />
                      <div>
                        <div className='font-medium text-base'>{officer.user.fullName}</div>
                      </div>
                    </div>

                    <Divider className='my-3' />

                    <div className='flex justify-between mb-1'>
                      <span className='text-gray-500'>
                        {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.TOTAL_STUDENT')}
                      </span>
                      <span className='font-medium'>{totalStudents}</span>
                    </div>

                    <div className='mt-3'>
                      <div className='flex justify-between mb-1'>
                        <span className='text-gray-500'>
                          {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.PROGRESSING')}
                        </span>
                        <span className='font-medium'>{workloadPercent}%</span>
                      </div>
                      <Progress percent={workloadPercent} size='small' strokeColor={strokeColor} />
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Table
              dataSource={careOfficers}
              columns={columns}
              rowKey='id'
              pagination={false}
              className='border rounded-lg'
            />
          )}

          <div className='mt-6 pt-4 border-t'>
            <div className='flex items-center mb-3'>
              <BarChartOutlined className='text-blue-500 mr-2' />
              <span className='font-medium'>
                {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.ANALYZE')}
              </span>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Cán bộ có tải cao nhất */}
                <div className='bg-white p-4 rounded-md border'>
                  <div className='text-sm text-gray-500 mb-1'>
                    {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.MAX_HANDLE_OFFICER')}
                  </div>
                  <div className='font-medium'>{maxOfficer?.user.fullName}</div>
                  <div className='text-sm text-gray-500'>
                    {maxLoad}% {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.LOAD')}
                  </div>
                </div>

                {/* Cán bộ có tải thấp nhất */}
                <div className='bg-white p-4 rounded-md border'>
                  <div className='text-sm text-gray-500 mb-1'>
                    {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.MIN_HANDLE_OFFICER')}
                  </div>
                  <div className='font-medium'>{minOfficer?.user.fullName}</div>
                  <div className='text-sm text-gray-500'>
                    {minLoad}% {t('STUDENT_NEED_CARE.DISTRIBUTE.OVERVIEW.LOAD')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  )
}

export default CareOfficerDistributionModal
