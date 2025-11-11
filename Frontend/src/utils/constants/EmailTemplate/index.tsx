import { useTranslation } from 'react-i18next'

export const useEmailTemplateTypeOptions = () => {
  const { t } = useTranslation()

  const emailTemplateTypeOptions = [
    {
      label: t('EMAILTEMPLATES.EMAILTEMPLATES_OPTIONS.ATTENDANCENOTIFICATION'),
      value: 'AttendanceNotification',
    },
    {
      label: t('EMAILTEMPLATES.EMAILTEMPLATES_OPTIONS.DEFERNOTIFICATION'),
      value: 'DeferNotification',
    },
    {
      label: t('EMAILTEMPLATES.EMAILTEMPLATES_OPTIONS.FAILEDSUBJECTNOTIFICATION'),
      value: 'FailedSubjectNotification',
    },
    {
      label: t('EMAILTEMPLATES.EMAILTEMPLATES_OPTIONS.UNKNOWN'),
      value: 'Unknown',
    },
    {
      label: t('EMAILTEMPLATES.EMAILTEMPLATES_OPTIONS.APPLICATIONNOTIFICATION'),
      value: 'ApplicationNotification',
    },
  ]
  return { emailTemplateTypeOptions }
}
