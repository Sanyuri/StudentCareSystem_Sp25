import { FC, ReactNode } from 'react'
import icon from '#utils/constants/icon.js'

const GlassIcon: FC = (): ReactNode => {
  return (
    <img
      loading='lazy'
      src={icon.glassIcon}
      alt='Glass icon'
      className='object-contain shrink-0 self-stretch my-auto w-6 aspect-square'
    />
  )
}

export default GlassIcon
