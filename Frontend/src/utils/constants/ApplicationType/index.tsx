import { useTranslation } from 'react-i18next'

export const useApplicationTypeOptions = () => {
  const { t } = useTranslation()

  const ApplicationTypeOptions = [
    {
      label: t('EMAILTEMPLATES.EMAILTEMPLATES_OPTIONS.ABSENCENOTIFICATION'),
      value: 'absenceNotification',
    },
    { label: t('EMAILTEMPLATES.EMAILTEMPLATES_OPTIONS.ABSENCENWARNING'), value: 'absenceWarning' },
  ]

  return { ApplicationTypeOptions }
}
