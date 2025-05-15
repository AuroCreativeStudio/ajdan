import { useState } from 'react';
import logo from '../../../assets/image/ajdan-dark-logo.png'; // Corrected path for logo
import LanguageToggle from '../../LanguageToggle'; // Corrected path for LanguageToggle

const Header = () => {
  return (
    <header className="bg-white px-6 py-0 relative max-md:px-4 max-md:py-2 max-sm:px-0 max-sm:py-1.5 border-b border-gray-200">
      <div className="flex items-center justify-between relative z-20">
        {/* Left: Language Selector */}
        <div className="text-xl text-black max-md:text-lg max-sm:text-base z-10">
          <LanguageToggle />
        </div>

        {/* Right: Logo */}
        <div>
          <a href="/">
            <img src={logo} alt="Logo" className="h-24 w-32 object-contain" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;


