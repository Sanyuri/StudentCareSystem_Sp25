import React, { Fragment } from 'react'
import { Button, Select, Input } from 'antd'
import { PhoneOutlined, CloseOutlined, KeyOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

interface CallControlsProps {
  userId: string
  isCalling: boolean
  fromNumberOptions: Array<{ value: string; label: string }>
  countryCodeOptions: Array<{ value: string; label: string }>
  selectedFromNumber: string | undefined
  selectedCountryCode: string
  setSelectedFromNumber: (value: string) => void
  setSelectedCountryCode: (value: string) => void
  phoneNumberValue: string
  setPhoneNumberValue: (value: string) => void
  handleCall: () => void
  handleHangup: () => void
  hasToken: boolean
  onGetToken?: () => void
}

const CallControls: React.FC<CallControlsProps> = ({
  userId,
  isCalling,
  fromNumberOptions,
  countryCodeOptions,
  selectedFromNumber,
  selectedCountryCode,
  setSelectedFromNumber,
  setSelectedCountryCode,
  phoneNumberValue,
  setPhoneNumberValue,
  handleCall,
  handleHangup,
  hasToken,
  onGetToken,
}) => {
  const { t } = useTranslation()
  return (
    <div className='p-4 rounded-lg mb-6'>
      <div className='flex flex-col gap-4 mb-4'>
        <Select
          placeholder={t('COMMON.FROM_NUMBER')}
          value={selectedFromNumber}
          onChange={(value) => setSelectedFromNumber(value)}
          className='w-full'
          options={fromNumberOptions}
        />
        <div className='flex gap-2'>
          <Select
            value={selectedCountryCode}
            onChange={(value) => setSelectedCountryCode(value)}
            className='w-24'
            options={countryCodeOptions}
          />
          <Input
            value={phoneNumberValue}
            onChange={(e) => setPhoneNumberValue(e.target.value)}
            placeholder={t('COMMON.CALL_TO')}
            className='flex-1'
          />
        </div>
      </div>
      <div className='flex gap-3 justify-center'>
        {!hasToken ? (
          <Button
            type='primary'
            onClick={onGetToken}
            icon={<KeyOutlined />}
            style={{ backgroundColor: '#4f46e5' }}
          >
            {t('COMMON.GET_TOKEN')}
          </Button>
        ) : (
          <Fragment>
            <Button
              type='primary'
              onClick={handleCall}
              disabled={!userId}
              icon={<PhoneOutlined />}
              style={{ backgroundColor: !userId ? undefined : '#10b981' }}
            >
              {t('COMMON.CALL')}
            </Button>
            <Button danger onClick={handleHangup} disabled={!isCalling} icon={<CloseOutlined />}>
              {t('COMMON.HANG_UP')}
            </Button>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default CallControls
