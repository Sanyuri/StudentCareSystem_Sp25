import { useTranslation } from 'react-i18next'
import useAuthStore from '#stores/authState.js'
import { CloseOutlined } from '@ant-design/icons'
import { RoleData } from '#types/Data/RoleData.js'
import { useRole } from '#hooks/api/role/useRole.js'
import { useState, useEffect, FC, ReactNode, useMemo } from 'react'
import { usePermissionByRole } from '#hooks/api/permission/usePermission.js'
import { useUserMutation } from '#hooks/api/account/useUserMutation.js'
import { CreateUserRequest } from '#src/types/RequestModel/ApiRequest.js'
import { Form, Input, Radio, Checkbox, Button, Modal, Space } from 'antd'
import { RoleValue } from '#utils/constants/role.js'
import AddIcon from '#assets/icon/Add.svg?react'
import ActivityLog from '#assets/icon/Movie time.svg?react'

const AddAccount: FC = (): ReactNode => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const permissionIds = Form.useWatch('permissionIds', form) ?? []
  const [role, setRole] = useState<string | undefined>(undefined)

  const { data: permissionsData, isLoading } = usePermissionByRole(role)
  const { data: rolesData } = useRole()
  const { t, i18n } = useTranslation()
  const currentLanguage: string = i18n.language
  const { role: roleStore } = useAuthStore()
  const { mutate } = useUserMutation()

  const permissions = useMemo(() => {
    return (
      permissionsData?.map((permission) => ({
        value: permission.id,
        label: currentLanguage === 'vi' ? permission.vietnameseName : permission.englishName,
        description: currentLanguage === 'vi' ? permission.vietnameseName : permission.englishName,
      })) || []
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsData])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRoleChange = (e: any): void => {
    setRole(e.target.value)
  }

  useEffect(() => {
    if (!isLoading && permissionsData) {
      if (
        role ===
        rolesData?.find((role: RoleData): boolean => role.roleType === RoleValue.MANAGER)?.id
      ) {
        form.setFieldsValue({
          permissionIds: permissions.map((p) => p.value),
        })
      } else {
        form.setFieldsValue({
          permissionIds: [],
        })
      }
    }
  }, [permissionsData, role, rolesData, form, permissions, isLoading])

  const handleCancel = (): void => {
    setIsModalVisible(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = (value: CreateUserRequest): void => {
    mutate(value, {
      onSuccess: (): void => {
        handleCancel()
        form.resetFields()

        setRole(undefined)
      },
    })
  }

  // Admin can create officer and manager but manager can create officer only
  const filteredRoles: RoleData[] | undefined = rolesData?.filter((roleItem: RoleData): boolean => {
    if (roleStore === RoleValue.ADMIN) {
      // Admin can see both Officer and Manager
      return roleItem.roleType === RoleValue.OFFICER || roleItem.roleType === RoleValue.MANAGER
    } else if (roleStore === RoleValue.MANAGER) {
      // Manager can only see Officer
      return roleItem.roleType === RoleValue.OFFICER
    }
    return false // Default case, no roles available
  })

  const handleVisibleModal = (): void => {
    setIsModalVisible(true)
  }

  const handleSubmitForm = (): void => {
    form.submit()
  }
  return (
    <div>
      <Button
        type='primary'
        size='large'
        icon={<AddIcon />}
        onClick={(): void => handleVisibleModal()}
      >
        {t('ACCOUNTS.LABEL.ADD_ACCOUNT')}
      </Button>
      <Modal
        title={<div className='text-lg font-bold '>{t(`ACCOUNTS.FORM.LABEL.ADD_NEW_ACCOUNT`)}</div>}
        open={isModalVisible}
        loading={isLoading}
        onCancel={handleCancel}
        centered
        styles={{
          body: {
            overflowX: 'hidden',
            maxHeight: '500px',
            overflowY: 'scroll', // Enable vertical scroll
            paddingBottom: '60px', // Avoid content being hidden behind the footer
          },
        }}
        closeIcon={<CloseOutlined />}
        width={900}
        footer={(): ReactNode => (
          <div className='flex gap-2.5'>
            <Button onClick={handleCancel} style={{ flex: 1, padding: '0 8px', height: '45px' }}>
              {t(`COMMON.CANCEL`)}
            </Button>
            <Button
              type='primary'
              onClick={handleSubmitForm}
              style={{ flex: 1, padding: '0 8px', height: '45px' }}
            >
              {t(`COMMON.CONFIRM`)}
            </Button>
          </div>
        )}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          className='p-2'
          initialValues={{ status: 'Inactive', permissionIds: [], showFeEmail: false }}
        >
          <Form.Item
            name='fullName'
            label={t(`ACCOUNTS.FORM.LABEL.FULL_NAME`)}
            rules={[
              { min: 6, message: t(`ACCOUNTS.FORM.VALIDATION_MESSAGE.MIN_NAME`) },
              { required: true, message: t(`ACCOUNTS.FORM.VALIDATION_MESSAGE.NULL_NAME`) },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='email'
            label={<span>{t(`ACCOUNTS.FORM.LABEL.EMAIL_ACCOUNT`)}</span>}
            rules={[
              { required: true, message: t(`ACCOUNTS.FORM.VALIDATION_MESSAGE.NULL_EMAIL`) },
              {
                type: 'email',
                message: t(`ACCOUNTS.FORM.VALIDATION_MESSAGE.INVALID_EMAIL`),
              },
            ]}
          >
            <Input
              onChange={(e) => {
                const emailValue = e.target.value
                if (emailValue.endsWith('@fpt.edu.vn')) {
                  form.setFieldsValue({
                    showFeEmail: true,
                  })
                } else {
                  form.setFieldsValue({
                    showFeEmail: false,
                    feEmail: undefined,
                  })
                }
              }}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.email !== currentValues.email ||
              prevValues.showFeEmail !== currentValues.showFeEmail
            }
          >
            {({ getFieldValue }) => {
              const showFeEmail = getFieldValue('showFeEmail')
              const email = getFieldValue('email')

              if (showFeEmail && email?.endsWith('@fpt.edu.vn')) {
                return (
                  <Form.Item
                    name='feEmail'
                    label={<span>{t(`ACCOUNTS.FORM.LABEL.FE_EMAIL_ACCOUNT`) || 'Email FE'}</span>}
                    rules={[
                      {
                        required: true,
                        message: t(`ACCOUNTS.FORM.VALIDATION_MESSAGE.NULL_FE_EMAIL`),
                      },
                      {
                        type: 'email',
                        message: t(`ACCOUNTS.FORM.VALIDATION_MESSAGE.NULL_EMAIL`),
                      },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve()
                          if (value.endsWith('@fe.edu.vn')) {
                            return Promise.resolve()
                          }
                          return Promise.reject(
                            new Error(
                              t('ACCOUNTS.FORM.VALIDATION_MESSAGE.INVALID_FE_EMAIL_DOMAIN'),
                            ),
                          )
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                )
              }
              return null
            }}
          </Form.Item>

          <Form.Item
            name='roleId'
            label={t(`ACCOUNTS.FORM.LABEL.ROLE`)}
            rules={[{ required: true, message: t(`ACCOUNTS.FORM.VALIDATION_MESSAGE.NULL_ROLE`) }]}
          >
            <Radio.Group onChange={onRoleChange}>
              {filteredRoles?.map((roleItem) => (
                <Space key={roleItem.id} direction='vertical'>
                  <Radio value={roleItem.id}>
                    {currentLanguage === 'vi'
                      ? roleItem.vietnameseName.toUpperCase()
                      : roleItem.englishName.toUpperCase()}
                    {/* Use i18n translation */}
                  </Radio>
                </Space>
              ))}
            </Radio.Group>
          </Form.Item>

          {role && (
            <>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: t(`ACCOUNTS.FORM.VALIDATION_MESSAGE.NULL_PERMISSION`),
                  },
                ]}
              >
                <label htmlFor='permissionIds' className='flex items-center w-full mb-2'>
                  <span className='font-semibold mr-4'>{t(`ACCOUNTS.FORM.LABEL.PERMISSIONS`)}</span>
                  <span className='font-bold flex-grow text-right mr-4'>
                    {permissionIds.length}/{permissionsData?.length}
                  </span>
                  <Button
                    type='link'
                    size='small'
                    onClick={() => {
                      const allPermissionIds = permissions.map((p) => p.value)
                      const isAllSelected = permissionIds.length === permissionsData?.length
                      form.setFieldsValue({
                        permissionIds: isAllSelected ? [] : allPermissionIds,
                      })
                    }}
                  >
                    {permissionIds.length === permissionsData?.length
                      ? t('PERMISSIONS.DESELECT_ALL')
                      : t('PERMISSIONS.SELECT_ALL')}
                  </Button>
                </label>
                <Form.Item name='permissionIds'>
                  <Checkbox.Group
                    value={form.getFieldValue('permissionIds')}
                    onChange={(checkedValues): void =>
                      form.setFieldsValue({ permissionIds: checkedValues })
                    }
                    className='w-full'
                  >
                    <div className='grid grid-cols-2 gap-4 w-full'>
                      {permissions.map((item): ReactNode => {
                        const isChecked = form.getFieldValue('permissionIds')?.includes(item.value) // Kiểm tra checkbox có được chọn hay không
                        return (
                          <div
                            key={item.value}
                            className={`border rounded p-2 flex items-center ${isChecked ? 'opacity-100' : 'opacity-50'}`} // Thay đổi màu nền
                          >
                            <ActivityLog />
                            <div className='flex flex-col flex-1'>
                              <span className='font-semibold'>{item.label}</span>
                              <span className='text-xs '>{item.description}</span>
                            </div>
                            <Checkbox value={item.value} /> {/* Checkbox nằm bên phải */}
                          </div>
                        )
                      })}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </Form.Item>

              <Form.Item
                name='status'
                label={t(`ACCOUNTS.FORM.LABEL.STATUS`)}
                rules={[
                  { required: true, message: t('ACCOUNTS.FORM.VALIDATION_MESSAGE.NULL_STATUS') },
                ]}
              >
                <Radio.Group>
                  <Space direction='vertical'>
                    <Radio value={'Active'}> {t(`ACCOUNTS.FORM.LABEL.ACTIVE`)}</Radio>
                    <Radio value={'Inactive'}> {t(`ACCOUNTS.FORM.LABEL.INACTIVE`)}</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default AddAccount
