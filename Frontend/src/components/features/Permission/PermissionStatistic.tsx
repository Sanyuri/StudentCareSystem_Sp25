import { usePermission } from '#hooks/api/permission/usePermission.js'
import { useRole } from '#hooks/api/role/useRole.js'
import { PermissionData } from '#src/types/Data/PermissionData.js'
import { getPermissionGroup, PermissionType } from '#src/types/Enums/PermissionType.js'
import { RoleValue } from '#utils/constants/role.js'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Card, Col, Progress, Row, Table } from 'antd'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface PermissionStatisticProps {
  comparisonData: Array<{
    role: {
      id?: string
      roleType: string
      englishName: string
      vietnameseName: string
    }
    totalEnabled: number
    totalPermissions: number
    percentage: number
    groupCounts: Record<string, { total: number; enabled: number }>
  }>
  permissionState: Record<string, Record<string, boolean>>
}

const PermissionStatistic: FC<PermissionStatisticProps> = ({
  comparisonData,
  permissionState,
}: PermissionStatisticProps): ReactNode => {
  const { t, i18n } = useTranslation()

  const currentLanguage = i18n.language
  const { data: roles } = useRole()
  const { data: permissionData } = usePermission()
  return (
    <div>
      <Row gutter={24} className='mb-6'>
        {comparisonData
          ?.filter((data) => data.role.roleType === 'Officer' || data.role.roleType === 'Manager')
          .map((data) => (
            <Col key={data.role.id} span={12}>
              <Card className='shadow-sm'>
                <div className='flex items-center mb-4'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      data.role.roleType === 'Officer' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}
                  >
                    <span
                      className={
                        data.role.roleType === 'Officer' ? 'text-blue-500' : 'text-purple-500'
                      }
                    >
                      {data.role.roleType.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className='text-lg font-semibold'>{data.role.englishName}</h2>
                    <p className='text-sm text-gray-500'>
                      {data.role.roleType === 'Officer'
                        ? t('PERMISSIONS.STANDARD_ACCESS')
                        : t('PERMISSIONS.EXTENDED_ACCESS')}
                    </p>
                  </div>
                </div>

                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='font-medium'>
                      {t('PERMISSIONS.OVERALL_PERMISSION_COVERAGE')}
                    </span>
                    <span className='text-gray-700'>{data.percentage}%</span>
                  </div>
                  <Progress
                    percent={data.percentage}
                    showInfo={false}
                    strokeColor={data.role.roleType === 'Officer' ? '#1890ff' : '#722ed1'}
                    className='mb-2'
                  />
                  <div className='text-right text-sm text-gray-600 space-y-1'>
                    <div>
                      <span className='text-base font-semibold text-blue-600'>
                        {data.totalEnabled}
                      </span>{' '}
                      {t('PERMISSIONS.PERMISSIONS_GRANTED')}
                    </div>
                    <div>
                      <span className='text-base font-semibold text-yellow-500'>
                        {data.totalPermissions - data.totalEnabled}
                      </span>{' '}
                      {t('PERMISSIONS.OUT_OF')}{' '}
                    </div>
                  </div>
                </div>

                {Object.entries(data.groupCounts).map(([groupName, counts]) => (
                  <div key={groupName} className='flex items-center justify-between mb-3'>
                    <div className='flex items-center'>
                      <div className='w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2'>
                        <span className='text-gray-500 text-xs'>
                          {groupName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span>
                        {t('PERMISSIONS.MANAGEMENT')} {groupName}
                      </span>
                    </div>
                    <div className='flex items-center'>
                      {data.role.roleType === 'Manager' && counts.enabled > 0 && (
                        <div
                          className='w-full bg-purple-100 h-1 rounded-full mr-2'
                          style={{ width: '80px' }}
                        >
                          <div
                            className='bg-purple-500 h-1 rounded-full'
                            style={{ width: `${(counts.enabled / counts.total) * 100}%` }}
                          ></div>
                        </div>
                      )}
                      <span className='text-sm'>
                        {counts.enabled}/{counts.total}
                      </span>
                    </div>
                  </div>
                ))}
              </Card>
            </Col>
          ))}
      </Row>

      <Card className='shadow-sm'>
        <h2 className='text-lg font-semibold mb-4'>{t('PERMISSIONS.PERMISSION_COMPARISON')}</h2>
        <p className='text-sm text-gray-500 mb-4'>{t('PERMISSIONS.COMPARE_PERMISSIONS')}</p>

        <Table
          dataSource={permissionData}
          rowKey='id'
          pagination={false}
          columns={[
            {
              title: t('PERMISSIONS.PERMISSION'),
              dataIndex: 'englishName',
              key: 'englishName',
              render: (text: unknown, record: PermissionData) => (
                <div className='font-medium'>
                  {currentLanguage === 'en' ? record.englishName : record.vietnameseName}
                </div>
              ),
            },
            {
              title: t('PERMISSIONS.CATEGORY'),
              dataIndex: 'permissionType',
              key: 'permissionType',
              render: (text: unknown, record: PermissionData) => {
                const groupName = getPermissionGroup(
                  record.permissionType as unknown as PermissionType,
                )
                const translatedGroupName = t(
                  `PERMISSIONS.GROUPS.${groupName.toUpperCase()}`,
                  groupName,
                )

                return (
                  <div className='flex items-center'>
                    <div className='w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2'>
                      <span className='text-gray-500 text-xs'>
                        {groupName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>
                      {t('PERMISSIONS.MANAGEMENT')} {translatedGroupName}
                    </span>
                  </div>
                )
              },
            },
            {
              title: (
                <div className='flex items-center justify-center'>
                  <div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2'>
                    <span className='text-blue-500 text-xs'>O</span>
                  </div>
                  {t('ROLE.OFFICER')}
                </div>
              ),
              key: 'officer',
              align: 'center',
              render: (_, record) => {
                const officerRole = roles?.find((r) => r.roleType === RoleValue.OFFICER)
                const officerHasPermission =
                  permissionState[officerRole?.id ?? '']?.[record.id || '']
                return officerHasPermission ? (
                  <CheckCircleOutlined className='text-green-500 text-lg' />
                ) : (
                  <CloseCircleOutlined className='text-red-500 text-lg' />
                )
              },
            },
            {
              title: (
                <div className='flex items-center justify-center'>
                  <div className='w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2'>
                    <span className='text-purple-500 text-xs'>M</span>
                  </div>
                  {t('ROLE.MANAGER')}
                </div>
              ),
              key: 'manager',
              align: 'center',
              render: (_, record) => {
                const managerRole = roles?.find((r) => r.roleType === RoleValue.MANAGER)
                const managerHasPermission =
                  permissionState[managerRole?.id ?? '']?.[record.id || '']
                return managerHasPermission ? (
                  <CheckCircleOutlined className='text-green-500 text-lg' />
                ) : (
                  <CloseCircleOutlined className='text-red-500 text-lg' />
                )
              },
            },
          ]}
          className='permission-comparison-table'
        />
      </Card>
    </div>
  )
}

export default PermissionStatistic
