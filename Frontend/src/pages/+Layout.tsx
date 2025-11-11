import _ from 'lodash'
import { Fragment, ReactNode } from 'react'
import '#assets/css/index.scss'
import '#assets/css/Layout/Layout.scss'
import '#assets/css/tailwind.scss'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import 'antd/dist/reset.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import useLoadingStore from '#stores/loadingState.js'
import i18n from '#src/plugins/i18n.js'
import 'react-quill/dist/quill.snow.css'
import { I18nextProvider } from 'react-i18next'
import DisableDevtool from 'disable-devtool'
import { disableDevtoolConfig } from '#src/configs/DisableDevtoolConfig.js'
import useTemplateStore from '#stores/templateState.js'
import Loading from '#components/common/Loading.js'
import { AUTO_CLOSE_TOAST } from '#src/configs/WebConfig.js'
import { usePageContext } from 'vike-react/usePageContext'
import { PageContext } from 'vike/types'
import { useAppSettingData } from '#hooks/api/appSetting/useAppSettingData.js'
import { GoogleReCaptchaProvider } from '@google-recaptcha/react'

function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const pageContext: PageContext = usePageContext()
  const { loading } = useLoadingStore()
  const { darkMode } = useTemplateStore()
  const { data: settingData } = useAppSettingData()
  if (_.find(settingData, { key: 'DISABLE_DEVTOOL' })?.value === 'true') {
    DisableDevtool(disableDevtoolConfig)
  }

  return (
    <Fragment>
      <I18nextProvider i18n={i18n}>
        <ToastContainer
          autoClose={AUTO_CLOSE_TOAST}
          position='top-right'
          theme={darkMode ? 'dark' : 'light'}
        />
        <GoogleReCaptchaProvider type='v2-checkbox' siteKey={pageContext.googleReCaptchaKey}>
          <GoogleOAuthProvider clientId={pageContext.googleId}>
            <Loading spinning={loading}>{children}</Loading>
          </GoogleOAuthProvider>
        </GoogleReCaptchaProvider>
      </I18nextProvider>

      <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
    </Fragment>
  )
}

export { Layout }
