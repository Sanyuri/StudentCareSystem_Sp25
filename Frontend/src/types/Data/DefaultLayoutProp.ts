import { ReactNode } from 'react'

export interface DefaultLayoutProps {
  headerContent?: ReactNode // Đặt ? để prop này là tùy chọn
  children: ReactNode
}
