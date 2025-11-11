import { FC, ReactNode } from 'react'
import { extractStaticStyle, StyleProvider } from 'antd-style'

const Wrapper: FC<Readonly<{ children: ReactNode }>> = ({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode => {
  return <StyleProvider cache={extractStaticStyle.cache}>{children}</StyleProvider>
}

export default Wrapper
