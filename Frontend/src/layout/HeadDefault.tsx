import React, { ReactNode } from 'react'
import image from '#utils/constants/image.js'

// Default <head> (can be overridden by pages)

const HeadDefault = (): ReactNode => {
  return (
    <>
      <meta charSet='UTF-8' />
      <meta name='author' content='QuangNV' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content='Student care system' />
      <link rel='icon' href={image.logoNoLetter} />
    </>
  )
}

export default HeadDefault
