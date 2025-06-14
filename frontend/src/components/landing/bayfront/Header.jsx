// Header.jsx
import React from 'react';
import logo from '../../../assets/image/ajdan-light-logo.png';
import LanguageToggle from '../../LanguageToggle';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-30 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Language Toggle */}
        <div className="text-xl text-white">
          <LanguageToggle />
        </div>

        {/* Logo */}
        <div>
          <a href="/">
            <img src={logo} alt="Logo" className="h-8 w-20 object-contain" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
