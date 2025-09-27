import './App.css';
import './index.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams, useNavigate } from "react-router-dom";

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
import Aboutus from './components/pages/Aboutus';

import Login from './cms/pages/Login';
import Dashboard from './cms/pages/DashboardPage';
import ProtectedRoute from './cms/components/ProtectedRoute';
import BlogListingCms from './cms/pages/BlogListingCms';
import BlogCreate from './cms/pages/BlogCreate';
import EditBlog from './cms/pages/EditBlog';
import NewsletterCms from './cms/pages/NewsletterCms';
import ContactListing from './cms/pages/ContactListing';
import ProjectList from './cms/pages/ProjectList';
import ProjectUpdate from './cms/pages/ProjectUpdate';
import TeamList from './cms/pages/TeamList';
import TeamCreate from './cms/pages/TeamCreate';
import TeamUpdate from './cms/pages/TeamUpdate';
import ProjectPopupList from './cms/pages/ProjectPopupList';
import UserList from './cms/pages/UserList';
import UserForm from './cms/pages/UserForm';
import Socialmedia from './cms/pages/Socialmedia';
import RoleList from './cms/pages/RoleList';
import RoleForm from './cms/pages/RoleForm';
import RoleProtectedRoute from './cms/components/RoleProtectedRoute';

import Alramis from './components/landing/Alramis/LandingPage';
import AjdanIsland from './components/landing/ajdan-island/LandingPage';
import AjdanBayfront from './components/landing/bayfront/LandingPage';
import Buhirat from './components/landing/buhirat/LandingPage';
import GrandSquare from './components/landing/grand-square/LandingPage';
import KhobarPeirs from './components/landing/khobar-peirs/LandingPage';
import Khuzam from './components/landing/khuzam/LandingPage';
import Sedra1Page from './components/landing/sedra-1/LandingPage';
import Nabadh from './components/landing/Nabadh-Al-Kobar/LandingPage';
import SbfPage from './components/landing/sbf/LandingPage';
import Waterfront from './components/landing/waterfront/LandingPage';
import Rejan from './components/landing/rejan/LandingPage';
import DarahAlfursan from './components/landing/darah-alfursan/LandingPage';
import DarahAlmadinah from './components/landing/darah-almadinah/LandingPage';
import DarahAlwajhah from './components/landing/darah-alwajhah/LandingPage';
import DarahMakkah from './components/landing/darah-makkah/LandingPage';
import DarahAlfursan2 from './components/landing/darah-alfursan2/LandingPage';
import DarahSadayem from './components/landing/darah-sadayem/LandingPage';
import Infiniti from './components/landing/infiniti/LandingPage';

import { detectLanguageByLocation } from './utils/geoLanguage';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import Navbar from './cms/components/Navbar';
import Sidebar from './cms/components/Sidebar';
import { logout } from './services/authService';

// Add CMS language context
export const CmsLangContext = createContext();

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isCmsRoute = location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/create') ||
    location.pathname.startsWith('/bloglist') ||
    location.pathname.startsWith('/edit') ||
    location.pathname.startsWith('/newsletter') ||
    location.pathname.startsWith('/contactlist') ||
    location.pathname.startsWith('/projectlist') ||
    location.pathname.startsWith('/projectupdate') ||
    location.pathname.startsWith('/teamlist') ||
    location.pathname.startsWith('/teamcreate') ||
    location.pathname.startsWith('/teamupdate') ||
    location.pathname.startsWith('/popuplist') ||
    location.pathname.startsWith('/userlist') ||
    location.pathname.startsWith('/user-create') ||
    location.pathname.startsWith('/user-edit') ||
    location.pathname.startsWith('/socialmedia-links') ||
    location.pathname.startsWith('/rolelist') ||
    location.pathname.startsWith('/role-create') ||
    location.pathname.startsWith('/role-edit') ||
    location.pathname.startsWith('/en/alramis')
    || location.pathname.startsWith('/ar/alramis')
    || location.pathname.startsWith('/en/ajdan-island')
    || location.pathname.startsWith('/ar/ajdan-island')
    || location.pathname.startsWith('/en/bayfront')
    || location.pathname.startsWith('/ar/bayfront')
    || location.pathname.startsWith('/en/buhirat')
    || location.pathname.startsWith('/ar/buhirat')
    || location.pathname.startsWith('/en/grand-square')
    || location.pathname.startsWith('/ar/grand-square')
    || location.pathname.startsWith('/en/khobar-peirs')
    || location.pathname.startsWith('/ar/khobar-peirs')
    || location.pathname.startsWith('/en/khuzam')
    || location.pathname.startsWith('/ar/khuzam')
    || location.pathname.startsWith('/en/sedra-1')
    || location.pathname.startsWith('/ar/sedra-1')
    || location.pathname.startsWith('/en/nabadh-al-kobar')
    || location.pathname.startsWith('/ar/nabadh-al-kobar')
    || location.pathname.startsWith('/en/sbf')
    || location.pathname.startsWith('/ar/sbf')
    || location.pathname.startsWith('/en/waterfront')
    || location.pathname.startsWith('/ar/waterfront')
    || location.pathname.startsWith('/en/rejan')
    || location.pathname.startsWith('/ar/rejan')
    || location.pathname.startsWith('/en/darah-alfursan')
    || location.pathname.startsWith('/ar/darah-alfursan')
    || location.pathname.startsWith('/en/darah-almadinah')
    || location.pathname.startsWith('/ar/darah-almadinah')
    || location.pathname.startsWith('/en/darah-alwajhah')
    || location.pathname.startsWith('/ar/darah-alwajhah')
    || location.pathname.startsWith('/en/darah-makkah')
    || location.pathname.startsWith('/ar/darah-makkah')
    || location.pathname.startsWith('/en/darah-alfursan2')
    || location.pathname.startsWith('/ar/darah-alfursan2')
    || location.pathname.startsWith('/en/darah-sadayem')
    || location.pathname.startsWith('/ar/darah-sadayem')
    || location.pathname.startsWith('/en/infiniti')
    || location.pathname.startsWith('/ar/infiniti');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isCmsRoute && <Header />}
      <main style={{ flex: 1 }}>{children}</main>
      {!isCmsRoute && <Footer />}   
     {!isCmsRoute &&<ConsentBanner/>}
    </div>
  );
}

function PublicRoutes() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
      document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [lang, i18n]);

  if (!['en', 'ar'].includes(lang)) {
    return <Navigate to="/en" replace />;
  }

  return (
    <Routes>  
      
      <Route path="/" element={<List />} />
      <Route path="/home" element={<Home />} />
      <Route path="/project-list" element={<List />} />
      <Route path="/search" element={<Search />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/test" element={<Sample />} />
      <Route path="/animation" element={<SmoothScrollHero />} />
      <Route path="/blogs" element={<BlogList locale={lang} />} />
      <Route path="/blog/:slug" element={<BlogSingle locale={lang} />} />
      <Route path="/aboutus" element={<Aboutus />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>

      <Route path="/alramis" element={<Alramis />} />
      <Route path="/ajdan-island" element={<AjdanIsland />} />
      <Route path="/bayfront" element={<AjdanBayfront />} />
      <Route path="/buhirat" element={<Buhirat />} />
      <Route path="/grand-square" element={<GrandSquare />} />
      <Route path="/khobar-peirs" element={<KhobarPeirs />} />
      <Route path="/khuzam" element={<Khuzam />} />
      <Route path="/sedra-1" element={<Sedra1Page />} />
      <Route path="/nabadh-al-kobar-2" element={<Nabadh />} />
      <Route path="/sbf" element={<SbfPage />} />
      <Route path="/waterfront" element={<Waterfront />} />
      <Route path="/rejan" element={<Rejan />} />
      <Route path="/darah-alfursan" element={<DarahAlfursan />} />
      <Route path="/darah-almadinah" element={<DarahAlmadinah />} />
      <Route path="/darah-alwajhah" element={<DarahAlwajhah />} />
      <Route path="/darah-makkah" element={<DarahMakkah />} />
      <Route path="/darah-alfursan2" element={<DarahAlfursan2 />} />
      <Route path="/darah-sadayem" element={<DarahSadayem />} />
      <Route path="/infiniti" element={<Infiniti />} />
      <Route path="*" element={<Navigate to={`/${lang}`} replace />} />
    </Routes>
  );
}


function CmsLayout({ children }) {
  const [cmsLang, setCmsLang] = useState(() => localStorage.getItem('cmsLang') || 'ar');

  useEffect(() => {
    document.dir = cmsLang === 'ar' ? 'rtl' : 'ltr';
  }, [cmsLang]);

  // Provide context to all CMS children
  return (
    <CmsLangContext.Provider value={{ cmsLang, setCmsLang }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8f8f8' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
        </div>
      </div>
    </CmsLangContext.Provider>
  );
}

function AppRoutes({ setToken, setUser, user }) {
  return (
    <Routes>
      
      {/* <Route path="/" element={<Navigate to="/en" replace />} /> */}
      <Route path="/:lang/*" element={<PublicRoutes />} />
      <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
      <Route
        path="/dashboard"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/bloglist"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <BlogListingCms  />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/create"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <BlogCreate />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/newsletter"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <NewsletterCms />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/contactlist"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <ContactListing />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/projectlist"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/projectUpdate"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <ProjectUpdate />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/teamlist"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <TeamList />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/teamcreate"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <TeamCreate />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/teamupdate"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <TeamUpdate />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/popuplist"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <ProjectPopupList />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
            <Route
        path="/socialmedia-links"
        element={
          <CmsLayout>
            <ProtectedRoute>
              <Socialmedia />
            </ProtectedRoute>
          </CmsLayout>
        }
      />
      <Route
        path="/userlist"
        element={
          <ProtectedRoute>
            <CmsLayout>
              <UserList />
            </CmsLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-create"
        element={
          <ProtectedRoute>
            <CmsLayout>
              <UserForm />
            </CmsLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-edit/:id"
        element={
          <ProtectedRoute>
            <CmsLayout>
              <UserForm />
            </CmsLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rolelist"
        element={
          <ProtectedRoute>
            <CmsLayout>
              <RoleList />
            </CmsLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/role-create"
        element={
          <ProtectedRoute>
            <CmsLayout>
              <RoleForm />
            </CmsLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/role-edit/:id"
        element={
          <ProtectedRoute>
            <CmsLayout>
              <RoleForm />
            </CmsLayout>
          </ProtectedRoute>
        }
      />
      {/* Fallback route for unmatched paths */}
      <Route path="*" element={null} />
    </Routes>
  );
}

function App() {
  const { i18n } = useTranslation();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  // Define CMS route prefixes
  const cmsPrefixes = [
    '/login',
    '/dashboard',
    '/bloglist',
    '/create',
    '/edit',
    '/newsletter',
    '/contactlist',
    '/projectlist',
    '/projectupdate',
    '/teamlist',
    '/teamcreate',
    '/teamupdate',
    '/popuplist',
    '/userlist',
    '/user-create',
    '/user-edit',
    '/rolelist',
    '/role-create',
    '/socialmedia-links', 
    '/role-edit'
  ];

  // useEffect(() => {
  //   console.log('App: useEffect for geo language detection running');
  //   const path = window.location.pathname;
  //   const pathMatch = path.match(/^\/(en|ar)(\/|$)/);
  //   const isCmsRoute = cmsPrefixes.some(prefix => path.toLowerCase().startsWith(prefix));
  //   if (!pathMatch && !isCmsRoute) {
  //     setLoading(true); // Start loading
  //     detectLanguageByLocation().then((detectedLang) => {
  //       const lang = ['en', 'ar'].includes(detectedLang) ? detectedLang : 'en';
  //       window.location.replace(`/${lang}${window.location.pathname}${window.location.search}`);
  //     });
  //   }
  // }, []);


  useEffect(() => {
  const path = window.location.pathname;
  const pathMatch = path.match(/^\/(en|ar)(\/|$)/);
  const isCmsRoute = cmsPrefixes.some(prefix => path.toLowerCase().startsWith(prefix));

  if (!pathMatch && !isCmsRoute) {
    window.location.replace(`/ar${window.location.pathname}${window.location.search}`);
  }
}, []);

  // Show loading spinner/message if loading and on root path
  if (loading && window.location.pathname === '/') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Detecting your language, please wait...</span>
      </div>
    );
  }

  return (
    <Router>
      <LayoutWrapper>
        <AppRoutes setToken={setToken} setUser={setUser} user={user} />
      </LayoutWrapper>
    </Router>
  );
}

export default App;
