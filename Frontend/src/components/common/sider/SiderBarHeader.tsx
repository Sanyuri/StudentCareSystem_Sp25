import { Menu, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import HideSiderIcon from '#assets/icon/Left side.svg?react'
type MenuItem = Required<MenuProps>['items'][number]

const SideBarHeader = ({
  darkMode,
  collapsed,
  setCollapsed,
}: {
  darkMode: boolean
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}) => {
  const { t } = useTranslation()

  const sideBarHeader: MenuItem[] = [
    {
      key: 'group1',
      label: '',
      type: 'group',
      children: [
        {
          key: 'collapse',
          icon: (
            <HideSiderIcon
              width={collapsed ? '16px' : '24px'}
              height={collapsed ? '16px' : '24px'}
            />
          ),
          label: <div>{!collapsed ? t('LAYOUT.HIDE_SIDER') : t('LAYOUT.DISPLAY_SIDER')}</div>,
          onClick: () => setCollapsed(!collapsed),
        },
      ],
    },
  ]

  return (
    <Menu
      theme={darkMode ? 'dark' : 'light'}
      mode='inline'
      selectable={false}
      items={sideBarHeader}
    />
  )
}

export default SideBarHeader
