import React from 'react';
import { 
  HiChartPie, 
  HiNewspaper, 
  HiMail, 
  HiPhone, 
  HiFolder, 
  HiUserGroup, 
  HiInformationCircle,
  HiLogout 
} from 'react-icons/hi';
import { useLocation } from 'react-router-dom';

function Sidebar({ handleLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    return currentPath === path || 
           (path !== '/' && currentPath.startsWith(path));
  };

  return (
    <div className="w-64 p-4 bg-white">
      <h2 className="mb-8 text-2xl font-bold text-blue-600">Dashboard</h2>
      <nav className="space-y-4">
        <a 
          href="/" 
          className={`flex items-center gap-2 px-2 py-2 rounded ${isActive('/') ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
        >
          <HiChartPie className="text-lg" /> Overview
        </a>
        <a 
          href="/bloglist" 
          className={`flex items-center gap-2 px-2 py-2 rounded ${isActive('/bloglist') ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
        >
          <HiNewspaper className="text-lg" /> News
        </a>
        <a 
          href="/newsletter" 
          className={`flex items-center gap-2 px-2 py-2 rounded ${isActive('/newsletter') ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
        >
          <HiMail className="text-lg" /> Newsletter
        </a>
        <a 
          href="/contactlist" 
          className={`flex items-center gap-2 px-2 py-2 rounded ${isActive('/contactlist') ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
        >
          <HiPhone className="text-lg" /> Contact Listing
        </a>
        <a 
          href="/projectlist" 
          className={`flex items-center gap-2 px-2 py-2 rounded ${isActive('/projectlist') ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
        >
          <HiFolder className="text-lg" /> Project Listing
        </a>
        <a 
          href="/teamlist" 
          className={`flex items-center gap-2 px-2 py-2 rounded ${isActive('/teamlist') ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
        >
          <HiUserGroup className="text-lg" /> About Us Team
        </a>
        <a 
          href="/popuplist" 
          className={`flex items-center gap-2 px-2 py-2 rounded ${isActive('/popuplist') ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
        >
          <HiInformationCircle className="text-lg" /> Popup List
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-8 text-red-500 hover:text-red-700"
        >
          <HiLogout className="text-lg" /> Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;