import { FC, ReactElement, ReactNode } from 'react'
import { Layout, Skeleton } from 'antd'
import useTemplateStore from '#stores/templateState.js'
import useLoadingStore from '#stores/loadingState.js'
import { useAppSettingData } from '#hooks/api/appSetting/useAppSettingData.js'
import ChatBotComponent from '#components/common/chatbot/ChatBotComponent.js'
import _ from 'lodash'

const { Content } = Layout
type ContentLayoutProps = {
  borderRadiusLG: number
  children: ReactNode
}

const ContentLayout: FC<ContentLayoutProps> = ({
  borderRadiusLG,
  children,
}: ContentLayoutProps): ReactElement => {
  const { darkMode } = useTemplateStore()
  const { loadingSider } = useLoadingStore()
  const { data: settingData } = useAppSettingData()

  return (
    <Content
      style={{
        color: darkMode ? '#fff' : '#000',
        background: darkMode ? '#141414' : '#f5f5f5',
        flex: 1,
        padding: '18px',
        maxHeight: 'calc(100% - 64px)',
      }}
    >
      <div
        style={{
          color: darkMode ? '#fff' : '#000',
          borderRadius: borderRadiusLG,
          background: darkMode ? '#141414' : '#fff',
        }}
      >
        <main className='flex flex-col p-4 rounded-2xl max-md:px-5'>
          {loadingSider ? <Skeleton active paragraph={{ rows: 16 }} /> : children}
        </main>
        {_.find(settingData, { key: 'ENABLE_CHATBOT' })?.value === 'true' && <ChatBotComponent />}
      </div>
    </Content>
  )
}

export default ContentLayout
