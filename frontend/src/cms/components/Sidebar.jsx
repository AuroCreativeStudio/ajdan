import React from 'react';
import { HiChartPie, HiUser, HiLogout } from 'react-icons/hi';

function Sidebar({ handleLogout }) {
  return (
    <div className="w-64 p-4 bg-white shadow-md">
      <h2 className="mb-8 text-2xl font-bold text-blue-600">Dashboard</h2>
      <nav className="space-y-4">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <HiChartPie /> Overview
        </a>
        <a href="/bloglist" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <HiUser /> News
        </a>
         <a href="/newsletter" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <HiUser /> NewsLetter
        </a>
        <a href="/contactlist" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
        <HiUser /> ContactListing
        </a>
         <a href="/projectlist" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
        <HiUser /> ProjectListing
        </a>
 <a href="/teamlist" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
        <HiUser />Aboutus Team Member
        </a>
         
 <a href="/popuplist" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
        <HiUser />Popup List
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-8 text-red-500 hover:text-red-700"
        >
          <HiLogout /> Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
