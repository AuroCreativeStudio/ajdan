import React, { useState } from 'react';
import {
  HiChartPie,
  HiNewspaper,
  HiMail,
  HiPhone,
  HiFolder,
  HiUserGroup,
  HiInformationCircle,
  HiLogout,
  HiMenu
} from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import ajdanLogo from '../../assets/image/ajdan-light-logo.png';


function Sidebar({ handleLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    return currentPath === path ||
      (path !== '/' && currentPath.startsWith(path));
  };

  // Detect direction from document.dir or i18n.language
  const dir = document.dir || 'ltr';
  const isRtl = dir === 'rtl';

  return (
    <div
      className={`fixed top-0 ${isRtl ? 'right-0' : 'left-0'} h-screen flex-shrink-0 p-4 bg-main-charcoal1 transition-all duration-300 z-20 ${collapsed ? 'w-[4.5rem]' : 'w-60'} flex flex-col items-center`}
      style={{ direction: dir }}
    >
      <div className="flex items-center mb-8">
        <button
          className="p-2 text-blue-600 focus:outline-none"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          {!collapsed ? (
            <img
              src={ajdanLogo}
              alt="Ajdan Logo"
              className="transition-all duration-300 w-16"
            />
          ) : (
            <HiMenu className="text-secondary-lavendergray6" />
          )}
        </button>
      </div>
      <nav className="space-y-4">
        <a
          href='dashboard'
          className={`flex items-center gap-2 px-2 py-2 rounded text-[14px] font-semibold ${isActive('/')
              ? 'text-secondary-lavendergray6 font-medium'
              : 'text-white hover:text-main-silver3-600 hover:bg-secondary-dustyblue1'
            }`}
        >
          <HiChartPie className="text-lg" />
          {!collapsed && 'Dashboard'}
        </a>
          <a
          href="/popuplist"
          className={`flex items-center gap-2 px-2 py-2 rounded text-[14px] font-semibold ${isActive('/popuplist')
              ? 'text-secondary-lavendergray6 font-medium'
              : 'text-white hover:text-main-silver3-600 hover:bg-secondary-dustyblue1'
            }`}
        >
          <HiInformationCircle className="text-lg" />
          {!collapsed && 'Project Enquiries'}
        </a>
          <a
          href="/contactlist"
          className={`flex items-center gap-2 px-2 py-2 rounded text-[14px] font-semibold ${isActive('/contactlist')
              ? 'text-secondary-lavendergray6 font-medium'
              : 'text-white hover:text-main-silver3-600 hover:bg-secondary-dustyblue1'
            }`}
        >
          <HiPhone className="text-lg" />
          {!collapsed && 'Contact Enquires Forms'}
        </a>
          <a
          href="/newsletter"
          className={`flex items-center gap-2 px-2 py-2 rounded text-[14px] font-semibold ${isActive('/newsletter')
              ? 'text-secondary-lavendergray6 font-medium'
              : 'text-white hover:text-main-silver3-600 hover:bg-secondary-dustyblue1'
            }`}
        >
          <HiMail className="text-lg" />
          {!collapsed && 'Newsletter Enquires'}
        </a>
           <a
          href="/teamlist"
          className={`flex items-center gap-2 px-2 py-2 rounded text-[14px] font-semibold ${isActive('/teamlist')
              ? 'text-secondary-lavendergray6 font-medium'
              : 'text-white hover:text-main-silver3-600 hover:bg-secondary-dustyblue1'
            }`}
        >
          <HiUserGroup className="text-lg" />
          {!collapsed && 'About Us Team'}
        </a>
          <a
          href="/projectlist"
          className={`flex items-center gap-2 px-2 py-2 rounded text-[14px] font-semibold ${isActive('/projectlist')
              ? 'text-secondary-lavendergray6 font-medium'
              : 'text-white hover:text-main-silver3-600 hover:bg-secondary-dustyblue1'
            }`}
        >
          <HiFolder className="text-lg" />
          {!collapsed && 'Project Listing'}
        </a>
       
        <a
          href="/bloglist"
          className={`flex items-center gap-2 px-2 py-2 rounded text-[14px] font-semibold ${isActive('/bloglist')
              ? 'text-secondary-lavendergray6 font-medium'
              : 'text-white hover:text-main-silver3-600 hover:bg-secondary-dustyblue1'
            }`}
        >
          <HiNewspaper className="text-lg" />
          {!collapsed && 'News'}
        </a>
        <a
          href="/userlist"
          className={`flex items-center gap-2 px-2 py-2 rounded text-[14px] font-semibold ${isActive('/userlist')
              ? 'text-secondary-lavendergray6 font-medium'
              : 'text-white hover:text-main-silver3-600 hover:bg-secondary-dustyblue1'
            }`}
        >
          <HiFolder className="text-lg" />
          {!collapsed && 'Users'}
        </a>
      
              <a
          href="/rolelist"
          className={`flex items-center gap-2 px-2 py-2 rounded text-[14px] font-semibold ${isActive('/rolelist')
              ? 'text-secondary-lavendergray6 font-medium'
              : 'text-white hover:text-main-silver3-600 hover:bg-secondary-dustyblue1'
            }`}
        >
          <HiFolder className="text-lg" />
          {!collapsed && 'Roles'}
        </a>
      
          <button
            type="button"
            onClick={e => { e.preventDefault(); handleLogout && handleLogout(); }}
            className="flex items-center gap-2 px-4 py-2 text-[16px] font-semibold text-red-500 hover:text-red-700"
          >

            {!collapsed && 'Logout'}
          </button>
      </nav>
    </div>
  );
}

export default Sidebar;