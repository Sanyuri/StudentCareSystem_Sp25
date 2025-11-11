import { useTranslation } from 'react-i18next'

export const useApplicationOptions = () => {
  const { t } = useTranslation()

  const applicationFilterTableOptions = [
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.ALL_STATUS'), value: '' },
  ]
  const applicationStatusFilterTableOptions = [
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.ALL_STATUS'), value: '' },
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.RECEIVE'), value: 'receive' },
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.RETURN'), value: 'return' },
  ]

  const applicationDateTableOptions = [
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.ALL_STATUS'), value: '' },
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.TODAY'), value: 'today' },
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.THIS_WEEK'), value: 'this-week' },
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.THIS_MONTH'), value: 'this-month' },
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.THIS_YEAR'), value: 'this-year' },
    { label: t('APPLICATIONS.APPLICATIONS_OPTIONS.DATE_RANGE'), value: 'date-range' },
  ]

  return {
    applicationFilterTableOptions,
    applicationDateTableOptions,
    applicationStatusFilterTableOptions,
  }
}
