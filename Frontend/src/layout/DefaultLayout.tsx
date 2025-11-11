import viVN from 'antd/locale/vi_VN'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import useTemplateStore from '#stores/templateState.js'
import { encryptStorage } from '#utils/helper/storage.js'
import { usePageContext } from 'vike-react/usePageContext'
import getActiveKeyFromUrl from '#utils/helper/getActiveKeyFromUrl.js'
import { DefaultLayoutProps } from '#src/types/Data/DefaultLayoutProp.js'
import SidebarComponent from '#components/common/sider/SideBarComponent.js'
import { useState, useEffect, useRef, FC, ReactNode, RefObject } from 'react'
import { ConfigProvider, Flex, Layout, theme, Grid, Breakpoint } from 'antd'
import HeaderLayout from '#components/common/header/Header.js'
import ContentLayout from '#components/common/contentLayout/ContentLayout.js'
import LogoLayout from '#components/common/logoLayout/LogoLayout.js'
import SiderBarHeader from '#components/common/sider/SiderBarHeader.js'
import PhoneCallSider from '#components/features/Phone/PhoneCallSider.js'
import PhoneSideTab from '#components/features/Phone/PhoneSideTab.js'
import { useAppSettingData } from '#hooks/api/appSetting/useAppSettingData.js'
import _ from 'lodash'

const { Sider } = Layout
const { useBreakpoint } = Grid

const DefaultLayout: FC<Readonly<DefaultLayoutProps>> = ({
  children,
}: Readonly<DefaultLayoutProps>): ReactNode => {
  const [collapsed, setCollapsed] = useState(false)
  const [phoneDrawerVisible, setPhoneDrawerVisible] = useState(false)

  const { data: settingData } = useAppSettingData()
  // Handle darkmode in encryptStorage
  const { darkMode, fontStyle } = useTemplateStore()
  const {
    token: { borderRadiusLG },
  } = theme.useToken()

  const { urlPathname, nonce } = usePageContext()
  const activeKey: string = getActiveKeyFromUrl(urlPathname)

  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()
  const siderRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  const [locale, setLocale] = useState(viVN) // Default locale

  useEffect(() => {
    const storedLang = encryptStorage.getItem('defaultLocale') || 'vi'

    // Determine and set the correct Ant Design locale based on the stored language
    switch (storedLang) {
      case 'en':
        setLocale(enUS)
        break
      case 'jp':
        setLocale(jaJP) // Japanese locale
        break
      case 'vi':
      default:
        setLocale(viVN) // Vietnamese locale
        break
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (siderRef.current && !siderRef.current.contains(event.target as Node)) {
        setCollapsed(true) // Collapse the sider if clicking outside
      }
    }

    if (screens.xs) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      if (screens.xs) {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [screens.xs]) // Depend on screens.sm to re-apply or remove the event listener

  const togglePhoneDrawer = () => {
    setPhoneDrawerVisible(!phoneDrawerVisible)
  }

  return (
    <ConfigProvider
      csp={{ nonce: nonce }}
      locale={locale}
      theme={{
        token: { fontFamily: fontStyle },
        components: {
          Table: {},
        },
        hashed: false,
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout hasSider style={{ minHeight: '100vh' }}>
        <Sider
          theme={darkMode ? 'dark' : 'light'}
          ref={siderRef}
          trigger={null}
          style={{
            overflow: 'auto',
            width: collapsed ? '80px' : '250px',
            height: '100%',
            position: 'fixed',
            insetInlineStart: 0,
            top: 0,
            bottom: 10,
            scrollbarWidth: 'thin',
            scrollbarColor: 'unset',
            transition: 'all 500ms ease',
            boxShadow: screens.xs ? '4px 0 8px rgba(0, 0, 0, 0.11)' : 'none',
            cursor: 'pointer',
          }}
          width={250}
          collapsible
          collapsed={collapsed}
          breakpoint='md' // Responsive breakpoint
          onBreakpoint={(broken) => setCollapsed(broken)} // Auto-collapse on smaller screens
        >
          <div className=''>
            <Flex vertical={false} justify='center'>
              <LogoLayout collapsed={collapsed} />
            </Flex>
          </div>
          <SiderBarHeader darkMode={darkMode} collapsed={collapsed} setCollapsed={setCollapsed} />
          <SidebarComponent darkMode={darkMode} activeKey={activeKey} collapsed={collapsed} />
        </Sider>

        <Layout
          style={{
            marginInlineStart: collapsed || !screens.md ? 80 : 250,
            transition: 'all 500ms ease',
          }}
        >
          <HeaderLayout />

          <ContentLayout borderRadiusLG={borderRadiusLG}>{children}</ContentLayout>
        </Layout>

        {/* Phone Call Floating Button */}
        {_.find(settingData, { key: 'ENABLE_CALL' })?.value === 'true' && (
          <PhoneSideTab onClick={togglePhoneDrawer} />
        )}

        {/* Phone Call Sider */}
        <PhoneCallSider visible={phoneDrawerVisible} onClose={() => setPhoneDrawerVisible(false)} />
      </Layout>
    </ConfigProvider>
  )
}

export default DefaultLayout
