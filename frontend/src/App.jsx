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

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isCmsRoute = location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/create') ||
    location.pathname.startsWith('/bloglist') ||
    location.pathname.startsWith('/edit');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isCmsRoute && <Header />}
      <main style={{ flex: 1 }}>{children}</main>
      {!isCmsRoute && <ConsentBanner />}
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


      <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/bloglist" element={<ProtectedRoute><BlogListingCms /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><BlogCreate /></ProtectedRoute>} />
      <Route path="/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />

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
