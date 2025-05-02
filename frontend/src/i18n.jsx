import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationAR from './locales/ar/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  }
};

i18n
  .use(LanguageDetector) // detects user language
  .use(initReactI18next) // passes i18n to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // fallback if language not detected
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie']
    }
  });

export default i18n;
