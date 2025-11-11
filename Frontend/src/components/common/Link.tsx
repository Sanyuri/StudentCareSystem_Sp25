import { FC, ReactNode } from 'react'

interface LinkProp {
  href: string
  children: string
  className?: string
}

export const Link: FC<LinkProp> = ({ href, children, className }: LinkProp): ReactNode => {
  return (
    <a className={className} title={children} href={href}>
      {children}
    </a>
  )
}
