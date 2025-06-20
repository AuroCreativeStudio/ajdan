import React, { useState, useEffect, useRef } from 'react';
import ajdanLogo from '../../assets/image/ajdan-light-logo.png';
import { FaUserCircle } from 'react-icons/fa'; // Add an icon
import { useTranslation } from 'react-i18next';
import { Switch } from "@material-tailwind/react";


const Navbar = ({ handleLogout }) => {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === 'en');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  // Close on outside click
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  const handleToggle = () => {
    const newLang = isEnglish ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    setIsEnglish(newLang === 'en');
  };

  return (
    <nav className="w-full h-16 flex items-center px-6 bg-main-charcoal1 border-b border-main-silver3 sticky top-0">
      {/* <img src={ajdanLogo} alt="Ajdan Logo" className="transition-all duration-300 w-16" /> */}
      <div className="flex-1" />

      {/* Profile Dropdown */}
      <div className="relative inline-block text-left">
        <button
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 text-white font-medium hover:text-gray-300"
        >
          <FaUserCircle className="text-2xl" />
          <span>Account</span>
        </button>

        {dropdownOpen && (
          <div
            ref={dropdown}
            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold">Andrio Miller</p>
              <p className="text-sm text-gray-500">miller@company.com</p>
            </div>
            <div className="py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  // Handle view profile action
                }}
              >
                View Profile
              </button>
  <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
    <span>{isEnglish ? 'EN' : 'AR'}</span>
    <Switch
      checked={!isEnglish}
      onChange={handleToggle}
      className="!bg-gray-300 checked:!bg-blue-500"
      circleProps={{
        className: "before:bg-white",
      }}
    />
  </div>

              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                onClick={() => handleLogout && handleLogout()}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
