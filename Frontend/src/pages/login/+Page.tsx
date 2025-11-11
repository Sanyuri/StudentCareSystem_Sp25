import LoginForm from '#components/features/Login/LoginForm.js'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import FPTLogo from '#assets/img/FPT_University.jpeg'
import image from '#utils/constants/image.js'
import _ from 'lodash'
import { useAppSettingData } from '#hooks/api/appSetting/useAppSettingData.js'
import { useTenantData } from '#hooks/api/tenant/useTenantData.js'
import authState from '#stores/authState.js'
import { Spin } from 'antd'

const Page: FC = (): ReactNode => {
  const [imageHeaderUrl, setImageHeaderUrl] = useState<string | undefined>(undefined)
  const { data: tenantData } = useTenantData()
  const { data: settingData, isLoading: isLoadingSetting } = useAppSettingData()

  const { campusCode, setCampusCode } = authState()
  useEffect(() => {
    const headerImage: string | undefined = _.find(settingData, { key: 'BODY_BACKGROUND' })?.value
    if (headerImage) {
      setImageHeaderUrl(headerImage)
    }
  }, [settingData])

  useEffect(() => {
    if (!campusCode) {
      setCampusCode(tenantData?.[0]?.identifier ?? '', tenantData?.[0]?.name ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantData])
  return (
    <main className='flex flex-col md:flex-row h-screen'>
      <div className='relative w-full md:w-1/2 flex-shrink-0 overflow-hidden'>
        {!isLoadingSetting ? (
          <img
            loading='lazy'
            src={imageHeaderUrl ?? FPTLogo}
            alt='FPT Logo'
            className='w-full h-full object-cover opacity-95 shadow-amber-50'
          />
        ) : (
          <div className='absolute inset-0 flex justify-center items-center bg-white/50'>
            <Spin size='large' />
          </div>
        )}
        <div className='absolute top-4 left-4 w-25 h-10 flex ml-2'>
          <img src={image.logoNoLetter} alt='FPT Logo' className={'w-25 h-10'} />
          <span className='my-auto ml-3 text-xl font-bold text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]'>
            Student Care System FPT
          </span>
        </div>
      </div>
      <div className='flex items-center justify-center px-4 md:px-12 md:w-1/2 flex-grow overflow-auto'>
        <LoginForm />
      </div>
    </main>
  )
}

export default Page
