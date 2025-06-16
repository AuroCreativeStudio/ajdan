// Header.jsx
import React from 'react';
import logo from '../../../assets/image/ajdan-light-logo.png';
import bayfrontlight from '../../../assets/landing images/BayfrontLight.png';
import LanguageToggle from '../../LanguageToggle';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-30 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Language Toggle */}
        <div className="text-sm sm:text-base text-white">
          <LanguageToggle />
        </div>

        {/* Logos */}
        <div>
          <a href="/" className="flex items-center space-x-2 sm:space-x-4">
            {/* Bayfront Logo */}
            <img
              src={bayfrontlight}
              alt="Bayfront Logo"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />

            {/* Divider */}
            <div className="h-6 sm:h-8 w-px bg-white opacity-50" />

            {/* Ajdan Logo */}
            <img
              src={logo}
              alt="Ajdan Logo"
              className="h-6 sm:h-7 md:h-8 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
