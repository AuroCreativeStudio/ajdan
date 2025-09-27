import { useTranslation } from "react-i18next";
import InstagramFeed from "./InstagramFeed"; // import the feed component we made

const Home = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="p-10 bg-blue-100 text-center">
        <h1
          lang={lang}
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          {t("hello")}
        </h1>
      </section>

      {/* Instagram Feed Section */}
      <section className="p-8 bg-white">
        <h2
          lang={lang}
          className="text-2xl font-semibold text-gray-800 mb-6 text-center"
        >
          {t("Instagram_feed")}
        </h2>
        <InstagramFeed />
      </section>


    </div>
  );
};

export default Home;
