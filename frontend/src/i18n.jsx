import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
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
  .use(initReactI18next) // passes i18n to react-i18next
  .init({
    resources,
    lng: 'en', // default, will be overridden by App.jsx/PublicRoutes
    fallbackLng: 'en', // fallback if language not detected
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
