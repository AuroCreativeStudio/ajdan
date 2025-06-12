import React from 'react';
import ajdanLogo from '../../assets/image/ajdan-light-logo.png';


const Navbar = ({ handleLogout }) => (
  <nav className="w-full z-40 h-16 flex items-center px-6 bg-main-charcoal1 border-b border-main-silver3 sticky top-0">
    {/* ...existing code... */}
      <img
                  src={ajdanLogo}
                  alt="Ajdan Logo"
                  className="transition-all duration-300 w-16"
                />
    <div className="flex-1" />
    
    <button
      type="button"
      onClick={e => { e.preventDefault(); handleLogout && handleLogout(); }}
      className="ml-auto px-4 py-2 text-red-500 hover:text-red-700 font-semibold"
    >
      Logout
    </button>
  </nav>
);

export default Navbar;
