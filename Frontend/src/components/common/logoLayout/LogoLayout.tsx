import { FC, ReactElement } from 'react'
import image from '#utils/constants/image.js'
import { Space, Typography } from 'antd'

const { Title } = Typography
type LogoLayoutProps = {
  collapsed: boolean
}
const LogoLayout: FC<LogoLayoutProps> = ({ collapsed }: LogoLayoutProps): ReactElement => {
  return (
    <div
      className='mx-4 mt-5'
      style={{
        position: 'relative',
        height: '30px',
        width: collapsed ? '40px' : '250px',
      }}
    >
      <a href='/'>
        <Space size={12} className='flex items-center'>
          <img
            src={image.logoNoLetter}
            alt='FPT Logo'
            width={40}
            height={40}
            className='object-contain'
          />
          {!collapsed && (
            <Title
              level={5}
              className='!m-0 '
              style={{
                fontSize: '13px',
              }}
            >
              Student Care System FPT
            </Title>
          )}
        </Space>
      </a>
    </div>
  )
}

export default LogoLayout
