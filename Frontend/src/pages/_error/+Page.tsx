import { FC, ReactNode } from 'react'
import { Button, Typography, Layout, Space } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { usePageContext } from 'vike-react/usePageContext'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography
const { Content } = Layout
export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const pageContext = usePageContext()
  const { abortStatusCode } = pageContext

  const getErrorDetails = () => {
    switch (Number(abortStatusCode)) {
      case 400:
        return {
          title: t('ERROR_PAGE.400.TITLE'),
          message: t('ERROR_PAGE.400.DESCRIPTION'),
        }
      case 401:
        return {
          title: t('ERROR_PAGE.401.TITLE'),
          message: t('ERROR_PAGE.401.DESCRIPTION'),
        }
      case 403:
        return {
          title: t('ERROR_PAGE.403.TITLE'),
          message: t('ERROR_PAGE.403.DESCRIPTION'),
        }
      case 404:
        return {
          title: t('ERROR_PAGE.404.TITLE'),
          message: t('ERROR_PAGE.404.DESCRIPTION'),
        }
      case 500:
        return {
          title: t('ERROR_PAGE.500.TITLE'),
          message: t('ERROR_PAGE.500.DESCRIPTION'),
        }
      case 503:
        return {
          title: t('ERROR_PAGE.503.TITLE'),
          message: t('ERROR_PAGE.503.DESCRIPTION'),
        }
      default:
        return {
          title: t('ERROR_PAGE.DEFAULT.TITLE'),
          message: t('ERROR_PAGE.DEFAULT.DESCRIPTION'),
        }
    }
  }

  const errorDetails = getErrorDetails()

  return (
    <Content
      style={{
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Space direction='vertical' align='center' size='large'>
        <Title level={1} style={{ marginBottom: 0 }}>
          {abortStatusCode}
        </Title>
        <Title level={3} style={{ marginTop: 0 }}>
          {errorDetails.title}
        </Title>
        <Paragraph style={{ fontSize: '16px', textAlign: 'center', maxWidth: '500px' }}>
          {errorDetails.message}
        </Paragraph>
        <a href='/'>
          <Button type='primary' icon={<HomeOutlined />} size='large'>
            {t('COMMON.BACK_HOME')}
          </Button>
        </a>
      </Space>
    </Content>
  )
}
