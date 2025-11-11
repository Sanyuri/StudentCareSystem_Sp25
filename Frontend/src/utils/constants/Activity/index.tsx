import { useTranslation } from 'react-i18next'

export const useActivityOptions = () => {
  const { t } = useTranslation()

  const activityFilterTableOptions = [
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.ALL'), value: '' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.LOGIN'), value: 'login' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.LOGOUT'), value: 'logout' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.SEND_EMAIL'), value: 'SendEmail' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.NOTE'), value: 'note' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.APPLICATION'), value: 'application' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.EMAILSAMPLE'), value: 'EmailSample' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.FREESUBJECT'), value: 'FreeSubject' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.USER'), value: 'user' },
  ]

  const activityDateTableOptions = [
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.TODAY'), value: 'today' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.THIS_WEEK'), value: 'this-week' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.THIS_MONTH'), value: 'this-month' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.THIS_YEAR'), value: 'this-year' },
    { label: t('ACTIVITIES.ACTIVITIES_OPTIONS.DATE_RANGE'), value: 'date-range' },
  ]

  return { activityFilterTableOptions, activityDateTableOptions }
}
