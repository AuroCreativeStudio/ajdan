
import { useState } from 'react';
import logo from '../assets/image/ajdan-dark-logo.png';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white px-10 py-5 relative max-md:px-8 max-md:py-4 max-sm:px-5 max-sm:py-2.5 border-b border-gray-200">
      <div className="flex items-center justify-between relative z-20">
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
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logo} alt="Logo" className="h-24 w-32 object-contain" />
        </div>

        {/* Right: Language Selector */}
        <div className="text-xl text-black max-md:text-lg max-sm:text-base z-10">
          <LanguageToggle />
        </div>
      </div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-50 shadow-lg z-20 transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out w-64`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
           <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
      </svg>
        </button>
        <ul className="mt-16 space-y-4 text-lg text-gray-700 p-4">
          <li>
            <a href="/" className="block py-2 px-4 hover:bg-gray-200 rounded-md">Home</a>
          </li>
          <li>
            <a href="/list" className="block py-2 px-4 hover:bg-gray-200 rounded-md">Lists</a>
          </li>
          <li>
            <a href="/search" className="block py-2 px-4 hover:bg-gray-200 rounded-md">Search</a>
          </li>
          <li>
            <a href="/Contact" className="block py-2 px-4 hover:bg-gray-200 rounded-md">Contact</a>
          </li>
          <li>
            <a href="/test" className="block py-2 px-4 hover:bg-gray-200 rounded-md">Test</a>
          </li>
          <li>
            <a href="/animation" className="block py-2 px-4 hover:bg-gray-200 rounded-md">Animation</a>
          </li>
          <li>
            <a href="/blogs" className="block py-2 px-4 hover:bg-gray-200 rounded-md">Blogs</a>
          </li>
          <li>
            <a href="/aboutus" className="Block py-2 px-4 hover:bg-gray-200 rounded-md">About Us</a>
            </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;


