import { Spin } from 'antd'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface LoadingProps {
  spinning: boolean
  children?: ReactNode
}

const Loading: FC<LoadingProps> = ({ spinning, children }: LoadingProps): ReactNode => {
  const { t } = useTranslation()
  return (
    <div className='relative w-full h-full'>
      {spinning && (
        <div className='fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex justify-center items-center z-[9999]'>
          <Spin size='large' tip={t('LOGIN.LOADING')} />
        </div>
      )}
      {children}
    </div>
  )
}

export default Loading
