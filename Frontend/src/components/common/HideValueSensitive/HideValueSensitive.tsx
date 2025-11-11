import _ from 'lodash'
import { FC, ReactElement } from 'react'
import SanitizedHTML from '#components/common/SanitizedHTML.js'
import { useAppSettingData } from '#hooks/api/appSetting/useAppSettingData.js'

interface HideValueSensitiveProps {
  data?: string
}

const HideValueSensitive: FC<HideValueSensitiveProps> = ({
  data,
}: HideValueSensitiveProps): ReactElement => {
  const { data: settingData } = useAppSettingData()
  if (_.find(settingData, { key: 'HIDE_SENSITIVE_DATA' })?.value === 'true') {
    return <SanitizedHTML htmlContent={'*********'} />
  }

  return <span>{data ?? 'Null'}</span>
}

export default HideValueSensitive
