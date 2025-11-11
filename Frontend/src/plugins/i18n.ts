// src/i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import locale files
import vi from '#locales/vi.json'
import en from '#locales/en.json'
import jp from '#locales/jp.json'
import { encryptStorage } from '#utils/helper/storage.js'
// Import other locales as needed

// Default locale
const defaultLocale: string = encryptStorage.getItem('defaultLocale') || 'vi'

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
      jp: { translation: jp },
      // Add other locales here
    },
    lng: defaultLocale, // Default language
    fallbackLng: 'vi', // Fallback language
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })
  .then((): void => {})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .catch((error: any): void => {
    // eslint-disable-next-line no-console
    console.error('Error initializing i18next:', error)
  })

export default i18n
