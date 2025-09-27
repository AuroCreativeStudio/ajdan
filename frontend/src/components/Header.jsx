import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/image/ajdan-dark-logo.png';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Try to get lang from URL, fallback to 'en'
  const match = location.pathname.match(/^\/(en|ar)(\/|$)/);
  const lang = match ? match[1] : 'en';

  // Helper to build links with lang prefix
  const withLang = (path) => `/${lang}${path.startsWith('/') ? path : '/' + path}`;

  // Language toggle handler
  const handleLangToggle = (newLang) => {
    if (newLang === lang) return;
    const newPath = location.pathname.replace(/^\/(en|ar)/, `/${newLang}`);
    navigate(newPath + location.search, { replace: true });
  };
  // Close menu and navigate
  const handleMenuClick = (path) => {
    setMenuOpen(false);
    navigate(withLang(path));
  };
  return (
    <header className="bg-white px-10 py-5 relative max-md:px-8 max-md:py-4 max-sm:px-5 max-sm:py-2.5 border-b border-gray-200">
      <div className="relative z-20 flex items-center justify-between">
        {/* Left: Menu Icon (toggler for sliding menu) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="z-10"
        >
          <svg
            width="98"
            height="24"
            viewBox="0 0 98 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="menu-svg"
          >
            <path
              d="M6.33334 20C5.95556 20 5.63912 19.872 5.384 19.616C5.12889 19.36 5.00089 19.0435 5 18.6666C4.99912 18.2898 5.12712 17.9733 5.384 17.7173C5.64089 17.4613 5.95734 17.3333 6.33334 17.3333H27.6667C28.0444 17.3333 28.3613 17.4613 28.6173 17.7173C28.8733 17.9733 29.0009 18.2898 29 18.6666C28.9991 19.0435 28.8711 19.3604 28.616 19.6173C28.3609 19.8742 28.0444 20.0018 27.6667 20H6.33334ZM6.33334 13.3333C5.95556 13.3333 5.63912 13.2053 5.384 12.9493C5.12889 12.6933 5.00089 12.3769 5 12C4.99912 11.6231 5.12712 11.3067 5.384 11.0507C5.64089 10.7947 5.95734 10.6667 6.33334 10.6667H27.6667C28.0444 10.6667 28.3613 10.7947 28.6173 11.0507C28.8733 11.3067 29.0009 11.6231 29 12C28.9991 12.3769 28.8711 12.6938 28.616 12.9507C28.3609 13.2075 28.0444 13.3351 27.6667 13.3333H6.33334ZM6.33334 6.66666C5.95556 6.66666 5.63912 6.53866 5.384 6.28266C5.12889 6.02666 5.00089 5.71022 5 5.33333C4.99912 4.95644 5.12712 4.64 5.384 4.384C5.64089 4.128 5.95734 4 6.33334 4H27.6667C28.0444 4 28.3613 4.128 28.6173 4.384C28.8733 4.64 29.0009 4.95644 29 5.33333C28.9991 5.71022 28.8711 6.02711 28.616 6.284C28.3609 6.54089 28.0444 6.66844 27.6667 6.66666H6.33334Z"
              fill="#293C47"
            />
          </svg>
        </button>

        {/* Center: Logo */}
        <div className="absolute transform -translate-x-1/2 left-1/2">
          <a href={withLang('/')}>
            <img src={logo} alt="Logo" className="object-contain w-32 h-24" />
          </a>
        </div>

        {/* Right: Language Selector */}
        <div className="z-10 text-xl text-black max-md:text-lg max-sm:text-base">
          <button
            onClick={() => handleLangToggle('en')}
            style={{
              fontWeight: lang === 'en' ? 'bold' : 'normal',
              textDecoration: lang === 'en' ? 'underline' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: lang === 'en' ? '#007bff' : '#333',
            }}
          >
            EN/
          </button>
          <button
            onClick={() => handleLangToggle('ar')}
            style={{
              fontWeight: lang === 'ar' ? 'bold' : 'normal',
              textDecoration: lang === 'ar' ? 'underline' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: lang === 'ar' ? '#007bff' : '#333',
            }}
          >
            AR
          </button>
        </div>
      </div>

      {/* Sliding Menu */}
       <div
        className={`fixed top-0 left-0 h-full w-full bg-gray-50 shadow-lg z-20 transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-700 ease-in-out w-64`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute text-gray-600 top-4 right-4 hover:text-gray-800"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
        
        {/* Centered Menu Content */}
        <div className="flex flex-col items-center justify-center h-full">
          <ul className="w-full space-y-6 text-lg text-center text-gray-700">
            <li>
              <button 
                onClick={() => handleMenuClick('/')} 
                className="block w-full px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleMenuClick('/aboutus')} 
                className="block w-full px-4 py-2 rounded-md hover:bg-gray-200"
              >
                About Us
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleMenuClick('/project-list')} 
                className="block w-full px-4 py-2 rounded-md hover:bg-gray-200"
              >
               Project Lists
              </button>
            </li>

            <li>
              <button 
                onClick={() => handleMenuClick('/blogs')} 
                className="block w-full px-4 py-2 rounded-md hover:bg-gray-200"
              >
                News
              </button>
            </li>
            
            {/* <li>
              <button 
                onClick={() => handleMenuClick('/search')} 
                className="block w-full px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Search
              </button>
            </li> */}
            <li>
              <button 
                onClick={() => handleMenuClick('/Contact')} 
                className="block w-full px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Contact
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleMenuClick('/test')} 
                className="block w-full px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Test
              </button>
            </li>
            {/* <li>
              <button 
                onClick={() => handleMenuClick('/animation')} 
                className="block w-full px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Animation
              </button>
            </li> */}
            
            
          </ul>
        </div>
        </div>
    </header>
  );
};

export default Header;


