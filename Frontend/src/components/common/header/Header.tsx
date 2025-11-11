import _ from 'lodash'
import { Header } from 'antd/es/layout/layout'
import { Avatar, Badge, Dropdown, MenuProps, Tooltip, Typography } from 'antd'
import useTemplateStore from '#stores/templateState.js'
import { FC, ReactElement, useEffect, useState } from 'react'
import useGetPageTitle from '#utils/helper/getPageTitle.js'
import { usePageContext } from 'vike-react/usePageContext'
import {
  BellOutlined,
  DashboardOutlined,
  LoadingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useNavigateWithLoading } from '#hooks/useNavigateSider.js'
import { DASHBOARD_PATH, SETTINGS_PATH } from '#utils/constants/path.js'
import useLoadingStore from '#stores/loadingState.js'
import { useLogoutMutation } from '#hooks/api/auth/useLogoutMutation.js'
import DarkModeSwitch from '#components/common/darkModeSwitch/DarkModeSwitch.js'
import useAuthStore from '#stores/authState.js'
import { useTranslation } from 'react-i18next'
import { useAppSettingData } from '#hooks/api/appSetting/useAppSettingData.js'
import { UserGuideUrl } from '#utils/constants/userGuide.js'

const { Title } = Typography

type MenuItem = Required<MenuProps>['items'][number]

const HeaderLayout: FC = (): ReactElement => {
  const { urlPathname } = usePageContext()
  const { t } = useTranslation()
  const { mutate: handleLogout } = useLogoutMutation()
  const pageTitle: string = useGetPageTitle(urlPathname)
  const { navigateWithLoading } = useNavigateWithLoading()
  // Handle darkmode in encryptStorage
  const { darkMode } = useTemplateStore()
  const { image: userAvatar, name, email, role, campusName } = useAuthStore()
  const [imageHeaderUrl, setImageHeaderUrl] = useState<string | undefined>(undefined)
  const { loadingSider } = useLoadingStore()

  const { data: settingData } = useAppSettingData()

  useEffect(() => {
    const headerImage: string | undefined = _.find(settingData, { key: 'HEADER_BACKGROUND' })?.value
    if (headerImage) {
      setImageHeaderUrl(`url(${headerImage})`)
    }
  }, [settingData])

  const menuItems: MenuItem[] = [
    {
      key: 'user-info',
      label: (
        <div
          style={{
            padding: '10px',
            textAlign: 'center',
            borderRadius: 5,
          }}
        >
          <Avatar size={48} src={userAvatar} key={userAvatar} />
          <div style={{ fontWeight: 'bold', marginTop: 5 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{email}</div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'dashboard-header',
      icon: loadingSider === 'dashboard-header' ? <LoadingOutlined /> : <DashboardOutlined />,
      label: t('HEADER.CONTROL_PANEL'),
      onClick: async (): Promise<void> =>
        await navigateWithLoading({
          path: DASHBOARD_PATH,
          loadingKey: 'dashboard-header',
        }),
    },
    {
      key: 'help-header',
      icon: loadingSider === 'help-header' ? <LoadingOutlined /> : <QuestionCircleOutlined />,
      label: (
        <a
          href={UserGuideUrl}
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: 'inherit' }}
        >
          {t('HEADER.HELP')}
        </a>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'settings-header',
      icon: loadingSider === 'settings-header' ? <LoadingOutlined /> : <SettingOutlined />,
      label: t('LAYOUT.SETTING'),
      onClick: async (): Promise<void> =>
        await navigateWithLoading({ path: SETTINGS_PATH, loadingKey: 'settings-header' }),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('LAYOUT.LOGOUT'),
      onClick: () => {
        handleLogout()
      },
    },
  ]

  const menu: MenuProps = {
    items: menuItems,
  }
  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: darkMode
          ? `linear-gradient(rgba(20, 20, 20, 0.8), rgba(20, 20, 20, 0.8)), ${imageHeaderUrl ?? ''} no-repeat center center / cover`
          : `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), ${imageHeaderUrl ?? ''} no-repeat center center / cover`,
        backdropFilter: 'blur(10px)',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: darkMode ? '#fff' : '#000',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Title of page*/}
      <Title ellipsis level={3} style={{ cursor: 'pointer', margin: 0 }}>
        {pageTitle}
      </Title>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notification button*/}
        <Tooltip title='Thông báo'>
          <Badge count={0}>
            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
        </Tooltip>

        {/* Switch Dark Mode */}
        <Tooltip title={darkMode ? t('HEADER.LIGHT_MODE') : t('HEADER.DARK_MODE')}>
          <DarkModeSwitch />
        </Tooltip>

        <Dropdown menu={menu} trigger={['click']} placement='bottomRight'>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
            <Avatar key={userAvatar} size='default' src={userAvatar} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 'initial' }}>
              <span style={{ fontWeight: 'bold', fontSize: 14 }}>{role}</span>
              <span style={{ fontSize: 12 }}>
                {t('LAYOUT.CAMPUS')} {campusName}
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  )
}

export default HeaderLayout
