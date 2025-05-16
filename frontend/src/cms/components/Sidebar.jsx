import React from 'react';
import { HiChartPie, HiUser, HiLogout } from 'react-icons/hi';

function Sidebar({ handleLogout }) {
  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">Dashboard</h2>
      <nav className="space-y-4">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <HiChartPie /> Overview
        </a>
        <a href="/bloglist" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <HiUser /> Blogs
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

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 mt-8"
        >
          <HiLogout /> Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
