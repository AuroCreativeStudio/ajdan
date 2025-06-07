import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchProjectPopups } from '../../services/projectPopupService';
import { paginate } from '../../services/paginate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProjectPopupList() {
  const { i18n } = useTranslation();
  const [popups, setPopups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPopup, setSelectedPopup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectPopups(i18n.language)
      .then(data => {
        const sanitizedPopups = (data?.data || []).map(popup => ({
          id: popup.id,
          title: popup.title || 'Untitled',
          slug: popup.slug || '',
          username: popup.username || 'N/A',
          phone: popup.phone || 'N/A',
          email: popup.email || 'N/A',
          message: popup.message || 'N/A',
          description: popup.description || 'N/A',
                    purchase_plan: popup.purchase_plan || 'N/A', // Add purchase_plan
        }));
        setPopups(sanitizedPopups);
      })
      .catch(error => {
        console.error('Error fetching project popups:', error);
        setPopups([]);
      });
  }, [i18n.language]);

  const handleView = (popup) => {
    setSelectedPopup(popup);
    setShowModal(true);
  };

  // Export data as CSV (Excel-compatible)
  const handleExport = () => {
    if (!popups.length) return;
    const header = ['Title', 'User', 'Phone', 'Email','Purchase Plan','Message', 'Description'];
    const rows = popups.map(p => [
      p.title,
      p.username,
      p.phone,
      p.email,
            p.purchase_plan, // Add purchase_plan to export
      p.message,
      p.description,
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.map(val => `"${val ?? ''}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-popups.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const ITEMS_PER_PAGE = 10; // Define how many items you want per page
  const paginatedPopups = paginate(popups, currentPage, ITEMS_PER_PAGE);

  return (
    <div className="flex h-screen bg-gray-100">
         <div className="w-64 bg-white border-r border-gray-200">
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between w-full mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Project Popups</h1>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Export Data
          </button>
        </div>

        <div className="relative overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Purchase Plan</th> {/* Add column */}
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPopups.length > 0 ? (
                paginatedPopups.map((popup) => (
                  <tr key={popup.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{popup.title}</td>
                    <td className="px-6 py-4">{popup.username}</td>
                    <td className="px-6 py-4">{popup.phone}</td>
                                        <td className="px-6 py-4">{popup.purchase_plan}</td> {/* Add cell */}
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleView(popup)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                    No project popups available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex mt-4 space-x-2">
          {Array.from({ length: Math.ceil(popups.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

     {showModal && selectedPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg">
      
      {/* Modal Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Project Contact Form Details</h3>
          <button
            onClick={() => setShowModal(false)}
            className="p-1 text-white rounded-full hover:bg-blue-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-4 text-sm text-gray-700">
        <div>
          <span className="font-medium text-gray-500">Title:</span>
          <p className="text-gray-900">{selectedPopup.title ?? 'N/A'}</p>
        </div>

        <div>
          <span className="font-medium text-gray-500">User:</span>
          <p className="text-gray-900">{selectedPopup.username ?? 'N/A'}</p>
        </div>

        <div>
          <span className="font-medium text-gray-500">Phone:</span>
          <p className="text-gray-900">{selectedPopup.phone ?? 'N/A'}</p>
        </div>

        <div>
          <span className="font-medium text-gray-500">Email:</span>
          <p className="text-gray-900 break-all">{selectedPopup.email ?? 'N/A'}</p>
        </div>
            <p><strong>Purchase Plan:</strong> {selectedPopup.purchase_plan}</p>
        <div>
          <span className="font-medium text-gray-500">Message:</span>
          <p className="text-gray-900 whitespace-pre-wrap">
            {selectedPopup.message || 'No message provided'}
          </p>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 text-right bg-gray-100">
        <button
          onClick={() => setShowModal(false)}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
