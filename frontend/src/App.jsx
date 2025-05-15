import './App.css';
import './index.css';
import { useTranslation } from 'react-i18next';
import { detectLanguageByLocation } from './utils/geoLanguage';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Header from './components/Header';
import Footer from './components/Footer';
import ConsentBanner from './components/ConsentBanner';

import Home from './components/pages/Home';
import List from './components/pages/List';
import Search from './components/pages/Search';
import Contact from './components/pages/Contact';
import Sample from './components/pages/Test';
import SmoothScrollHero from './components/pages/animation';
import BlogList from './components/pages/BlogList';
import BlogSingle from './components/pages/BlogSingle';

import Login from './cms/pages/Login';
import Dashboard from './cms/pages/DashboardPage';
import ProtectedRoute from './cms/components/ProtectedRoute';
import BlogListingCms from './cms/pages/BlogListingCms';
import BlogCreate from './cms/pages/BlogCreate';
import EditBlog from './cms/pages/Editblog';
import Aboutus from './components/pages/Aboutus';
import NewsletterCms from './cms/pages/NewsletterCms';
import ContactListing from './cms/pages/ContactListing'

import Ajdan2Page from './components/landing/ajdan-II/LandingPage';
import AjdanIsland from './components/landing/ajdan-island/LandingPage';
import AjdanBayfront from './components/landing/bayfront/LandingPage';
import Buhirat from './components/landing/buhirat/LandingPage';
import GrandSquare from './components/landing/grand-square/LandingPage';
import KhobarPeirs from './components/landing/khobar-peirs/LandingPage';
import Khuzam from './components/landing/khuzam/LandingPage';
import Sedra1Page from './components/landing/sedra-1/LandingPage';
import Sedra2Page from './components/landing/sedra-2/LandingPage';
import SbfPage from './components/landing/sbf/LandingPage';
import Waterfront from './components/landing/waterfront/LandingPage';
import Rejan from './components/landing/rejan/LandingPage';
import DarahAlfursan from './components/landing/darah-alfursan/LandingPage';
import DarahAlmadinah from './components/landing/darah-almadinah/LandingPage';
import DarahAlwajhah from './components/landing/darah-alwajhah/LandingPage';
import DarahMakkah from './components/landing/darah-makkah/LandingPage';
import DarahQomrah from './components/landing/darah-qomrah/LandingPage';
import DarahSadayem from './components/landing/darah-sadayem/LandingPage';
import Infiniti from './components/landing/infiniti/LandingPage';



function LayoutWrapper({ children }) {
  const location = useLocation();
  const isCmsRoute = location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/create') ||
    location.pathname.startsWith('/bloglist') ||
    location.pathname.startsWith('/edit') ||
    location.pathname.startsWith('/newsletter') ||
    location.pathname.startsWith('/contactlist') ||
    location.pathname.startsWith('/ajdanII') ||
    location.pathname.startsWith('/ajdan-island') ||
    location.pathname.startsWith('/bayfront') ||
    location.pathname.startsWith('/buhirat') ||
    location.pathname.startsWith('/grand-square') ||
    location.pathname.startsWith('/khobar-peirs') ||
    location.pathname.startsWith('/khuzam') ||
    location.pathname.startsWith('/rejan') ||
    location.pathname.startsWith('/sbf') ||
    location.pathname.startsWith('/sedra-1') ||
    location.pathname.startsWith('/sedra-2') ||
    location.pathname.startsWith('/waterfront') ||
    location.pathname.startsWith('/darah-alfursan') ||
    location.pathname.startsWith('/darah-almadinah') ||
    location.pathname.startsWith('/darah-alwajhah') ||
    location.pathname.startsWith('/darah-makkah') ||
    location.pathname.startsWith('/darah-qomrah') ||
    location.pathname.startsWith('/darah-sadayem') ||
    location.pathname.startsWith('/infiniti');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isCmsRoute && <Header />}
      <main style={{ flex: 1 }}>{children}</main>
      {/* {!isCmsRoute && <ConsentBanner />} */}
      {!isCmsRoute && <Footer />}
    </div>
  );
}

function AppRoutes({ setToken, setUser }) {
  return (
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
      <Route path="/blog/:slug" element={<BlogSingle />} />
      <Route path="aboutus" element={<Aboutus />} />

      <Route path="/ajdanII" element={<Ajdan2Page />} />
      <Route path="/ajdan-island" element={<AjdanIsland />} />
      <Route path="/bayfront" element={<AjdanBayfront />} />
      <Route path="/buhirat" element={<Buhirat />} />
      <Route path="/grand-square" element={<GrandSquare />} />
      <Route path="/khobar-peirs" element={<KhobarPeirs />} />
      <Route path="/khuzam" element={<Khuzam />} />
      <Route path="/rejan" element={<Rejan />} />
      <Route path="/sbf" element={<SbfPage />} />
      <Route path="/sedra-1" element={<Sedra1Page />} />
      <Route path="/sedra-2" element={<Sedra2Page />} />
      <Route path="/waterfront" element={<Waterfront />} />
      <Route path="/darah-alfursan" element={<DarahAlfursan />} />
      <Route path="/darah-almadinah" element={<DarahAlmadinah />} />
      <Route path="/darah-alwajhah" element={<DarahAlwajhah />} />
      <Route path="/darah-makkah" element={<DarahMakkah />} />
      <Route path="/darah-qomrah" element={<DarahQomrah />} />
      <Route path="/darah-sadayem" element={<DarahSadayem />} />
      <Route path="/infiniti" element={<Infiniti />} />


      <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/bloglist" element={<ProtectedRoute><BlogListingCms /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><BlogCreate /></ProtectedRoute>} />
      <Route path="/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
      <Route path="/newsletter" element={<ProtectedRoute><NewsletterCms /></ProtectedRoute>} />
      <Route path="/contactlist" element={<ProtectedRoute><ContactListing /></ProtectedRoute>} />

    </Routes>
  );
}

function App() {
  const { i18n } = useTranslation();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

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
      <LayoutWrapper>
        <AppRoutes setToken={setToken} setUser={setUser} />
      </LayoutWrapper>
    </Router>
  );
}

export default App;
