import { toast } from 'react-toastify'
import { navigate } from 'vike/client/router'
import { useTranslation } from 'react-i18next'
import useAuthStore from '#stores/authState.js'
import { RoleValue } from '#utils/constants/role.js'
import { UserSwitchOutlined } from '@ant-design/icons'
import { AccountService } from '#src/services/AccountService.js'
import { useAccountData } from '#hooks/api/account/useAccountData.js'
import { Button, Col, Row, Select, Typography, Spin, Empty } from 'antd'
import { useSignAsUserMutation } from '#hooks/api/auth/useAuthMutation.js'
import { FilterStatus } from '#src/types/RequestModel/AccountListRequest.js'
import { FC, ReactNode, useState, useEffect, Fragment, useMemo } from 'react'

const { Title } = Typography
const { Option } = Select

const SignAsComponent: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined)
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('Active')
  const [pageSize, setPageSize] = useState<number>(10)
  const [searchText, setSearchText] = useState<string>('')

  const { setAuthData } = useAuthStore()

  const { data: users, isLoading } = useAccountData(
    selectedStatus,
    selectedRole as RoleValue | undefined,
  )
  const { mutate: signAsUser, isPending: isSigningAs } = useSignAsUserMutation()

  // Filter user
  const filteredUsers = useMemo(
    () =>
      users?.items?.filter((user) => {
        const searchLower = searchText.toLowerCase()
        return (
          user.fullName.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          false
        )
      }) || [],
    [users?.items, searchText],
  )

  const { totalUsers, paginatedUsers } = useMemo(
    () => ({
      totalUsers: filteredUsers.length,
      paginatedUsers: filteredUsers.slice(0, pageSize),
    }),
    [filteredUsers, pageSize],
  )

  useEffect(() => {
    setSelectedUserId(undefined)
    setPageSize(10)
  }, [selectedRole, selectedStatus, searchText])

  const handleSignAsUser = () => {
    if (!selectedUserId) {
      toast.error(t('SETTINGS.SELECT_USER_REQUIRED'))
      return
    }

    signAsUser(selectedUserId, {
      onSuccess: (data) => {
        setAuthData(data.jwtToken, data.refreshToken, data.role, data.name, data.email, data.image)
        void AccountService.addRefreshToken({
          refreshToken: data.refreshToken,
          accessToken: data.jwtToken,
        })
        void navigate('/')
      },
    })
  }

  const handleRoleChange = (value: string) => {
    setSelectedRole(value)
    setSelectedUserId(undefined)
  }

  const handleStatusChange = (value: FilterStatus) => {
    setSelectedStatus(value)
    setSelectedUserId(undefined)
  }

  return (
    <Fragment>
      <Title level={5} className='my-6 flex items-center'>
        <UserSwitchOutlined className='mr-2' /> {t('SETTINGS.SIGN_AS_USER')}
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div className='mb-2 text-gray-600 text-sm'>{t('COMMON.SEARCH_STATUS')}</div>
          <Select
            placeholder={t('COMMON.SEARCH_STATUS')}
            style={{ width: '100%' }}
            onChange={handleStatusChange}
            value={selectedStatus}
            className='mb-4'
          >
            <Option key='' value=''>
              {t('COMMON.ALL')}
            </Option>
            <Option key='Active' value='Active'>
              {t('ACCOUNTS.FORM.LABEL.ACTIVE')}
            </Option>
            <Option key='Inactive' value='Inactive'>
              {t('ACCOUNTS.FORM.LABEL.INACTIVE')}
            </Option>
          </Select>
        </Col>

        <Col xs={24} md={12}>
          <div className='mb-2 text-gray-600 text-sm'>{t('COMMON.SEARCH_ROLE')}</div>
          <Select
            placeholder={t('COMMON.SEARCH_ROLE')}
            style={{ width: '100%' }}
            onChange={handleRoleChange}
            allowClear
            value={selectedRole}
            className='mb-4'
          >
            {Object.values(RoleValue).map((roleType) => (
              <Option key={roleType} value={roleType}>
                {roleType}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <div className='mt-2 mb-4'>
        <div className='mb-2 text-gray-600 text-sm'>{t('SETTINGS.SELECT_USER')}</div>
        <Select
          placeholder={t('SETTINGS.SELECT_USER')}
          style={{ width: '100%' }}
          onChange={(userId) => setSelectedUserId(userId)}
          showSearch
          value={selectedUserId}
          loading={isLoading}
          filterOption={false}
          onSearch={setSearchText}
          searchValue={searchText}
          notFoundContent={
            isLoading ? <Spin size='small' /> : <Empty description={t('COMMON.NO_DATA')} />
          }
          options={paginatedUsers.map((user) => ({
            key: user.id,
            value: user.id,
            label: `${user.fullName} - ${user.email}`,
          }))}
          dropdownRender={(menu) => (
            <div>
              {menu}
              {filteredUsers.length > paginatedUsers.length && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '10px',
                    cursor: 'pointer',
                    color: '#1890ff',
                    borderTop: '1px solid #f0f0f0',
                    fontWeight: 500,
                  }}
                  onClick={() => setPageSize(pageSize + 10)}
                >
                  {t('COMMON.LOAD_MORE')} ({paginatedUsers.length}/{totalUsers})
                </div>
              )}
            </div>
          )}
        />
      </div>

      <div className='flex justify-end mt-4'>
        <Button
          type='primary'
          onClick={handleSignAsUser}
          disabled={!selectedUserId || isSigningAs}
          loading={isSigningAs}
          icon={<UserSwitchOutlined />}
          size='large'
        >
          {t('SETTINGS.SIGN_AS')}
        </Button>
      </div>
    </Fragment>
  )
}

export default SignAsComponent
