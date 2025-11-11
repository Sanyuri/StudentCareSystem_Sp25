import { Menu, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  ACTIVITY_PATH,
  AI_SETTINGS_PATH,
  EMAIL_LOG_PATH,
  MANAGE_ACCOUNT_PATH,
  PERMISSION_MANAGEMENT_PATH,
  SETTINGS_PATH,
} from '#utils/constants/path.js'
import {
  CalendarOutlined,
  LoadingOutlined,
  MailOutlined,
  OpenAIOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import useLoadingStore from '#stores/loadingState.js'
import { useNavigateWithLoading } from '#hooks/useNavigateSider.js'
import { SideBarProps } from '#types/Props/SidebarProp.js'
import { FC } from 'react'

type MenuItem = Required<MenuProps>['items'][number]

const SideBarAdmin: FC<SideBarProps> = ({ darkMode, activeKey, collapsed }: SideBarProps) => {
  const { t } = useTranslation()
  const { loadingSider } = useLoadingStore()
  const { navigateWithLoading } = useNavigateWithLoading()
  const sideBarAdmin: MenuItem[] = [
    {
      key: '1',
      label: '',
      type: 'group',
      children: [
        {
          key: 'manage-account',
          icon:
            loadingSider === 'manage-account' ? (
              <LoadingOutlined />
            ) : (
              <UserOutlined style={{ fontSize: collapsed ? '16px' : '24px' }} />
            ),
          label: <span>{t('LAYOUT.STAFF_ACCOUNTS')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({ path: MANAGE_ACCOUNT_PATH, loadingKey: 'manage-account' }),
        },

        {
          key: 'email-log',
          icon:
            loadingSider === 'email-log' ? (
              <LoadingOutlined />
            ) : (
              <MailOutlined style={{ fontSize: collapsed ? '16px' : '24px' }} />
            ),
          label: <span>{t('LAYOUT.EMAIL_LOG')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({ path: EMAIL_LOG_PATH, loadingKey: 'email-log' }),
        },
        {
          key: 'activity',
          icon:
            loadingSider === 'activity' ? (
              <LoadingOutlined />
            ) : (
              <CalendarOutlined style={{ fontSize: collapsed ? '16px' : '24px' }} />
            ),
          label: <span>{t('LAYOUT.ACTIVITY_LOG')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({ path: ACTIVITY_PATH, loadingKey: 'activity' }),
        },
        {
          key: 'manage-permission',
          icon:
            loadingSider === 'manage-permission' ? (
              <LoadingOutlined />
            ) : (
              <TeamOutlined style={{ fontSize: collapsed ? '16px' : '24px' }} />
            ),
          label: <span>{t('LAYOUT.PERMISSION')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: PERMISSION_MANAGEMENT_PATH,
              loadingKey: 'manage-permission',
            }),
        },
        {
          key: 'settings',
          icon:
            loadingSider === 'settings' ? (
              <LoadingOutlined />
            ) : (
              <SettingOutlined style={{ fontSize: collapsed ? '16px' : '24px' }} />
            ),
          label: <span>{t('LAYOUT.SETTING')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: SETTINGS_PATH,
              loadingKey: 'settings',
            }),
        },
        {
          key: 'ai-setting',
          icon:
            loadingSider === 'ai-setting' ? (
              <LoadingOutlined />
            ) : (
              <OpenAIOutlined style={{ fontSize: collapsed ? '16px' : '24px' }} />
            ),
          label: <span>{t('LAYOUT.AI_SETTINGS')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: AI_SETTINGS_PATH,
              loadingKey: 'ai-setting',
            }),
        },
      ],
    },
  ]
  return (
    <Menu
      theme={darkMode ? 'dark' : 'light'}
      selectedKeys={[activeKey, loadingSider ?? '']}
      mode='inline'
      items={sideBarAdmin}
    />
  )
}

export default SideBarAdmin
