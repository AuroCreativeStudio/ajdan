import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
    const header = ['Title', 'User', 'Phone', 'Email', 'Message', 'Description'];
    const rows = popups.map(p => [
      p.title,
      p.username,
      p.phone,
      p.email,
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
      <Sidebar handleLogout={handleLogout} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[300px] max-w-[90vw]">
            <h2 className="mb-4 text-xl font-bold">{selectedPopup.title}</h2>
            <p><strong>User:</strong> {selectedPopup.username}</p>
            <p><strong>Phone:</strong> {selectedPopup.phone}</p>
            <p><strong>Email:</strong> {selectedPopup.email}</p>
            <p><strong>Message:</strong> {selectedPopup.message}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
