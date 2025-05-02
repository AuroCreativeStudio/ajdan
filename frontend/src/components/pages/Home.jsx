import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="p-10 bg-blue-100 text-center">
      <h2 className="text-3xl font-bold text-blue-600">{t('hello')}</h2>
      {/* <p className="mt-4 text-gray-700">{t('tailwind_working')}</p> */}
    </div>
  );
};

export default Home;
