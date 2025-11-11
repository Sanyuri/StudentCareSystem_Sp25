import _ from 'lodash'
import { toast } from 'react-toastify'
import { reload } from 'vike/client/router'
import TabPane from 'antd/es/tabs/TabPane.js'
import { useTranslation } from 'react-i18next'
import { useRole } from '#hooks/api/role/useRole.js'
import { RoleValue } from '#utils/constants/role.js'
import { useState, ReactNode, FC, useEffect } from 'react'
import { PermissionData } from '#types/Data/PermissionData.js'
import { UpdateRolePermission } from '#types/RequestModel/ApiRequest.js'
import { useUpdateRoleMutation } from '#hooks/api/role/useRoleMutation.js'
import PermissionImage from '#components/features/Permission/PermissionImage.js'
import { Switch, Card, Button, Tabs, Input, Progress, Modal, Tooltip } from 'antd'
import { PermissionType, getPermissionGroup } from '#types/Enums/PermissionType.js'
import PermissionStatistic from '#components/features/Permission/PermissionStatistic.js'
import { usePermission, usePermissionByRole } from '#hooks/api/permission/usePermission.js'
import { useAutoSetPermissionMutation } from '#hooks/api/permission/usePermissionMutation.js'
import { ClearOutlined, SelectOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons'
export const Page: FC = (): ReactNode => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language
  const { data: permissionData } = usePermission()
  const { data: roles } = useRole()
  const { mutate: updateRolePermission } = useUpdateRoleMutation()
  const { mutate: autoSetPermission } = useAutoSetPermissionMutation()
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState('permissions')
  const [searchTerm, setSearchTerm] = useState('')
  const { data: permissionWithRole } = usePermissionByRole(selectedRole)
  const [permissionState, setPermissionState] = useState<Record<string, Record<string, boolean>>>(
    {},
  )
  const [selectedRoleType, setSelectedRoleType] = useState<string>(RoleValue.OFFICER)

  const autoGroupedPermissions = permissionData?.reduce(
    (acc, perm) => {
      const groupName = getPermissionGroup(perm.permissionType as unknown as PermissionType)
      const translatedGroupName = t(`PERMISSIONS.GROUPS.${groupName.toUpperCase()}`, groupName)
      if (!acc[translatedGroupName]) acc[translatedGroupName] = []
      acc[translatedGroupName].push(perm)
      return acc
    },
    {} as Record<string, typeof permissionData>,
  )

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (typeof selectedRole === 'string') {
      setPermissionState((prev) => ({
        ...prev,
        [selectedRole]: {
          ...prev[selectedRole],
          [permissionId]: checked,
        },
      }))
    }
  }

  useEffect(() => {
    if (roles && !selectedRole) {
      const defaultRoleId = roles.find((r) => r.roleType === RoleValue.OFFICER)?.id
      setSelectedRole(defaultRoleId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles])

  const handleSelectAll = (permissions: PermissionData[], value: boolean) => {
    if (typeof selectedRole === 'string') {
      setPermissionState((prev) => ({
        ...prev,
        [selectedRole]: {
          ...prev[selectedRole],
          ...permissions.reduce((acc, permission) => {
            if (!permission.id) {
              return acc
            }
            return {
              ...acc,
              [permission.id]: value,
            }
          }, {}),
        },
      }))
    }
  }

  const handleDeselectAll = (permissions: PermissionData[]) => {
    handleSelectAll(permissions, false)
  }

  useEffect(() => {
    if (permissionWithRole && selectedRole) {
      const rolePermissions = permissionWithRole.reduce(
        (acc: Record<string, boolean>, permission: { id: string }) => {
          acc[permission.id] = true
          return acc
        },
        {},
      )
      setPermissionState((prev) => ({
        ...prev,
        [selectedRole]: rolePermissions,
      }))
    }
  }, [permissionWithRole, selectedRole])

  const handleSave = async () => {
    if (!selectedRole) {
      toast.error(t('PERMISSION.NO_ROLE_SELECTED'))
      return
    }

    // Check if selectedRole exists in permissionState
    if (!permissionState[selectedRole]) {
      return
    }

    const enabledPermissions = _.chain(permissionState[selectedRole])
      .entries() // Get key-value pairs
      .filter(([, isEnabled]) => isEnabled) // Filter pairs with value = true
      .map(([permissionId]) => permissionId) // Get key (permissionId)
      .value()

    const selectedRoleData = roles?.find((role) => role.id === selectedRole)

    if (!selectedRoleData) {
      toast.error(t('PERMISSION.ROLE_NOT_FOUND'))
      return
    }

    const updateData: UpdateRolePermission = {
      id: selectedRole,
      vietnameseName: selectedRoleData.vietnameseName || '',
      englishName: selectedRoleData.englishName || '',
      permissionIds: enabledPermissions,
    }

    // Call update api
    updateRolePermission(
      {
        id: selectedRole,
        updateData: updateData,
      },
      {
        onSuccess: () => {
          void reload()
        },
      },
    )
  }

  const handleRoleSelect = (roleType: string) => {
    setSelectedRoleType(roleType)
    const roleId = roles?.find((r) => r.roleType === roleType)?.id
    setSelectedRole(roleId)
  }

  const getPermissionCount = (groupName: string) => {
    const permissions = autoGroupedPermissions?.[groupName] || []
    const enabledCount = permissions.filter(
      (p) => permissionState[selectedRole ?? '']?.[p.id || ''],
    ).length
    return `${enabledCount}/${permissions.length}`
  }

  const getTotalPermissionCount = () => {
    if (!permissionData || !selectedRole) return '0/0'
    const totalPermissions = permissionData.length
    const enabledPermissions = Object.values(permissionState[selectedRole] || {}).filter(
      Boolean,
    ).length
    return `${enabledPermissions}/${totalPermissions}`
  }

  const getPermissionPercentage = () => {
    if (!permissionData || !selectedRole) return 0
    const totalPermissions = permissionData.length
    const enabledPermissions = Object.values(permissionState[selectedRole] || {}).filter(
      Boolean,
    ).length
    return Math.round((enabledPermissions / totalPermissions) * 100)
  }

  const filteredPermissions = (groupName: string) => {
    const permissions = autoGroupedPermissions?.[groupName] || []
    if (!searchTerm) return permissions
    return permissions.filter(
      (p) =>
        p.vietnameseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.englishName?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Comparison data for statistics tab
  const comparisonData = roles?.map((role) => {
    const rolePermissions = permissionState[role.id || ''] || {}
    const totalEnabled = Object.values(rolePermissions).filter(Boolean).length
    const totalPermissions = permissionData?.length ?? 0

    const groupCounts = {} as Record<string, { total: number; enabled: number }>

    Object.entries(autoGroupedPermissions || {}).forEach(([groupName, permissions]) => {
      groupCounts[groupName] = {
        total: permissions.length,
        enabled: permissions.filter((p) => rolePermissions[p.id || '']).length,
      }
    })

    return {
      role,
      totalEnabled,
      totalPermissions,
      percentage: totalPermissions > 0 ? Math.round((totalEnabled / totalPermissions) * 100) : 0,
      groupCounts,
    }
  })

  const [isSyncModalVisible, setIsSyncModalVisible] = useState(false)

  const handleSyncPermissions = () => {
    if (!selectedRole) {
      toast.error(t('PERMISSION.NO_ROLE_SELECTED'))
      return
    }

    setIsSyncModalVisible(true)
  }

  const handleConfirmSync = async () => {
    autoSetPermission(undefined, {
      onSuccess: () => {
        setIsSyncModalVisible(false)
      },
    })
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-2'>{t('PERMISSIONS.ROLE_PERMISSION_MANAGEMENT')}</h1>
      <p className='text-gray-500 mb-6'>{t('PERMISSIONS.MANAGE_ACCESS_PERMISSIONS')}</p>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className='mb-6'>
        <TabPane tab={<span>{t('PERMISSIONS.PERMISSIONS')}</span>} key='permissions' />
        <TabPane tab={<span>{t('PERMISSIONS.STATISTICS')}</span>} key='statistics' />
      </Tabs>

      {activeTab === 'permissions' ? (
        <>
          <div className='flex justify-between items-center mb-6'>
            <div className='flex gap-4'>
              {roles
                ?.filter(
                  (role) =>
                    role.roleType === RoleValue.OFFICER || role.roleType === RoleValue.MANAGER,
                )
                .map((role) => (
                  <Button
                    key={role.id}
                    type={selectedRoleType === role.roleType ? 'primary' : 'default'}
                    onClick={() => handleRoleSelect(role.roleType)}
                    className={`px-6 py-2 ${selectedRoleType === role.roleType ? 'bg-blue-500' : ''}`}
                  >
                    {currentLanguage === 'en' ? role.englishName : role.vietnameseName}
                  </Button>
                ))}
            </div>

            <Tooltip title={t('PERMISSIONS.SYNC_ACCOUNTS_TOOLTIP')}>
              <Button
                type='primary'
                icon={<SyncOutlined />}
                onClick={handleSyncPermissions}
                className='bg-green-500 hover:bg-green-600'
              >
                {t('PERMISSIONS.SYNC_ACCOUNTS')}
              </Button>
            </Tooltip>
          </div>

          <Card className='mb-6 shadow-sm'>
            <div className='flex items-center mb-2'>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                <span className='text-blue-500 font-semibold'>{selectedRoleType?.charAt(0)}</span>
              </div>
              <div>
                <h2 className='text-lg font-semibold'>{selectedRoleType}</h2>
                <p className='text-sm text-gray-500'>
                  {selectedRoleType === RoleValue.OFFICER
                    ? t('PERMISSIONS.STANDARD_ACCESS')
                    : t('PERMISSIONS.EXTENDED_ACCESS')}
                </p>
              </div>
            </div>

            <div className='mt-4'>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-medium'>{t('PERMISSIONS.PERMISSION_COVERAGE')}</span>
                <span className='text-gray-700'>{getPermissionPercentage()}%</span>
              </div>
              <Progress
                percent={getPermissionPercentage()}
                showInfo={false}
                strokeColor='#1890ff'
                className='mb-2'
              />
              <div className='text-right text-sm text-gray-500'>
                {getTotalPermissionCount()} {t('PERMISSIONS.PERMISSIONS_GRANTED')}
              </div>
            </div>
          </Card>
          <Modal
            title={t('PERMISSIONS.SYNC_PERMISSIONS')}
            open={isSyncModalVisible}
            onOk={handleConfirmSync}
            onCancel={() => setIsSyncModalVisible(false)}
            okText={t('COMMON.CONFIRM')}
            cancelText={t('COMMON.CANCEL')}
          >
            <p>{t('PERMISSIONS.SYNC_CONFIRMATION')}</p>
            <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md'>
              <p className='text-yellow-700'>{t('PERMISSIONS.SYNC_WARNING')}</p>
            </div>
          </Modal>
          <div className='mb-4 flex justify-between'>
            <Input
              placeholder={t('PERMISSIONS.SEARCH_PERMISSIONS')}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='max-w-md'
            />
            <div>
              <Button
                onClick={() => handleDeselectAll(permissionData || [])}
                icon={<ClearOutlined />}
                className='mr-2'
              >
                {t('PERMISSIONS.DESELECT_ALL')}
              </Button>
              <Button
                onClick={() => handleSelectAll(permissionData || [], true)}
                icon={<SelectOutlined />}
                className='mr-2'
              >
                {t('PERMISSIONS.SELECT_ALL')}
              </Button>
              <Button type='primary' onClick={handleSave} className='bg-blue-500'>
                {t('PERMISSIONS.SAVE_PERMISSIONS')}
              </Button>
            </div>
          </div>

          {Object.entries(autoGroupedPermissions || {}).map(([groupName, permissions]) => (
            <Card key={groupName} className='mb-4 shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center'>
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                    <span className='text-blue-500'>{groupName.charAt(0).toUpperCase()}</span>
                  </div>
                  <h3 className='text-lg font-medium'>
                    {t('PERMISSIONS.MANAGEMENT')} {groupName}
                  </h3>
                </div>
                <div className='flex items-center'>
                  <span className='text-sm text-gray-500 mr-4'>
                    {getPermissionCount(groupName)}
                  </span>
                  <Button
                    size='small'
                    onClick={() => handleSelectAll(permissions, true)}
                    className='mr-2'
                  >
                    {t('PERMISSIONS.ALL')}
                  </Button>
                  <Button size='small' onClick={() => handleDeselectAll(permissions)}>
                    {t('PERMISSIONS.NONE')}
                  </Button>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {filteredPermissions(groupName).map((permission) => (
                  <div
                    key={permission.id}
                    className='flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50'
                  >
                    <div className='font-medium flex items-center'>
                      {currentLanguage === 'en'
                        ? permission.englishName
                        : permission.vietnameseName}
                      <PermissionImage permission={permission} />
                    </div>
                    <div className='flex items-center'>
                      <Switch
                        checked={!!permissionState[selectedRole ?? '']?.[permission.id || '']}
                        onChange={(checked) => handlePermissionChange(permission.id || '', checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <div className='flex justify-between items-center mt-6'>
            <div className='text-sm text-gray-500'>
              {getTotalPermissionCount()} {t('PERMISSIONS.OF_TOTAL_PERMISSIONS')}
            </div>
            <Button type='primary' onClick={handleSave} className='bg-blue-500'>
              {t('PERMISSIONS.SAVE_PERMISSIONS')}
            </Button>
          </div>
        </>
      ) : (
        // Statistics Tab
        <PermissionStatistic
          comparisonData={comparisonData || []}
          permissionState={permissionState}
        />
      )}
    </div>
  )
}
