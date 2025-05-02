import './App.css';
import { useTranslation } from 'react-i18next';
import ConsentBanner from './components/ConsentBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/pages/Home';
import './index.css';
import { detectLanguageByLocation } from './utils/geoLanguage';
import { useEffect } from 'react';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const detectLanguage = async () => {
      const detectedLang = await detectLanguageByLocation();
      // Change language based on location
      i18n.changeLanguage(detectedLang);
      // Set document direction based on the detected language
      document.dir = detectedLang === 'ar' ? 'rtl' : 'ltr';
    };

    detectLanguage();
  }, [i18n]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Home />
      </main>
      <ConsentBanner />
      <Footer />
    </div>
  );
}

export default App;
