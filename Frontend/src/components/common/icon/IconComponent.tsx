import useTemplateStore from '#stores/templateState.js'
import { FC, ReactNode } from 'react'

interface IconComponentProps {
  src: string
  alt: string
}

export const IconComponent: FC<IconComponentProps> = ({
  src,
  alt,
}: IconComponentProps): ReactNode => {
  const { darkMode } = useTemplateStore()
  return <img src={src} alt={alt} className={`${darkMode ? 'invert' : 'invert-0'}`} />
}
