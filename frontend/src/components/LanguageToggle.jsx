import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr'; 
  };

  return (
    <div style={{ marginBottom: '5px' }}>
      <button onClick={() => changeLanguage('en')}>EN/</button>
      <button onClick={() => changeLanguage('ar')}>AR</button>
    </div>
  );
};

export default LanguageToggle;
