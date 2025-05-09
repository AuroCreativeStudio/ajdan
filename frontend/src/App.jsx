import './App.css';
import { useTranslation } from 'react-i18next';
import ConsentBanner from './components/ConsentBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/pages/Home';
import './index.css';
import { detectLanguageByLocation } from './utils/geoLanguage';
import { useEffect } from 'react';
import List from './components/pages/List';
import Search from './components/pages/Search';
import Contact from './components/pages/Contact';
import Sample from './components/pages/Test';
import SmoothScrollHero from './components/pages/animation';
import BlogList from './components/pages/BlogList';
import BlogSingle from './components/pages/BlogSingle';
import CmsRoutes from './cms/cmsRoutes';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './cms/pages/LoginPage';
import DashboardPage from './cms/pages/DashboardPage';
import ProtectedRoute from './cms/components/ProtectedRoute';


function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const detectLanguage = async () => {
      const detectedLang = await detectLanguageByLocation();

      i18n.changeLanguage(detectedLang);

      document.dir = detectedLang === 'ar' ? 'rtl' : 'ltr';
    };

    detectLanguage();
  }, [i18n]);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<List />} />
            <Route path="/search" element={<Search />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/test" element={<Sample />} />
            <Route path="/animation" element={<SmoothScrollHero />} />
            <Route path="/blogs" element={<BlogList locale="en" />} />
            <Route path="/blogs/:slug" element={<BlogSingle locale="en" />} />
            <Route path="/ar/blogs" element={<BlogList locale="ar" />} />
            <Route path="/ar/blogs/:slug" element={<BlogSingle locale="ar" />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/blog/:slug" element={<BlogSingle />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <ConsentBanner />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
