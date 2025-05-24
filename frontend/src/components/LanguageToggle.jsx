import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const match = location.pathname.match(/^\/(en|ar)(\/|$)/);
  const lang = match ? match[1] : 'en';

  const handleLangToggle = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    // Defensive: check i18n and its changeLanguage function
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(newLang);
      document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    }
    const newPath = location.pathname.replace(/^\/(en|ar)/, `/${newLang}`);
    navigate(newPath + location.search, { replace: true });
  };

  return (
    <button onClick={handleLangToggle}>
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  );
};

export default LanguageToggle;
