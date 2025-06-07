import { useTranslation } from "react-i18next";

const Home = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ar' ? 'ar' : undefined;

  return (
    <div className="p-10 bg-blue-100 text-center">
      <h4 lang={lang}>{t('hello')}</h4>
    </div>
  );
};

export default Home;
