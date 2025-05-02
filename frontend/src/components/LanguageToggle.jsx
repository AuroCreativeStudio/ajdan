import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr'; 
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>Arabic</button>
    </div>
  );
};

export default LanguageToggle;
