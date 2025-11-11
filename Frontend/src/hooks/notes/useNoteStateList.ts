import { SelectProps } from 'antd'
import { useTranslation } from 'react-i18next'

export const useNoteStateList = () => {
  const { t } = useTranslation()
  const noteStateList: SelectProps['options'] = [
    {
      value: -1,
      label: t('NOTES.STATE.ALL'),
    },
    {
      value: 1,
      label: t('NOTES.STATE.HAS_NOTE'),
    },
    {
      value: 0,
      label: t('NOTES.STATE.NOT_NOTE'),
    },
  ]
  return noteStateList
}
