import { useTranslation } from 'react-i18next'

export const useAccountOptions = () => {
  const { t } = useTranslation()

  const AccountFilterTableOptions = [
    { label: t('ACCOUNTS.ACCOUNTS_OPTIONS.ALL'), value: '' },
    { label: t('ACCOUNTS.ACCOUNTS_OPTIONS.INACTIVE'), value: 'Inactive' },
    { label: t('ACCOUNTS.ACCOUNTS_OPTIONS.ACTIVE'), value: 'Active' },
  ]

  return { AccountFilterTableOptions }
}
