import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchProjectPopups, deleteProjectPopup } from '../../services/projectPopupService';
import { paginate } from '../../services/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeletePopup from './DeletePopup';

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
          purchase_plan: popup.purchase_plan || 'N/A',
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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPopup(null);
  };

  const handleDelete = async (popupId) => {
    try {
      await deleteProjectPopup(popupId);
      toast.success("Contact deleted successfully");
      setPopups(prev => prev.filter(popup => popup.id !== popupId));
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      toast.error("Failed to delete contact");
    }
  };

  const handleExport = () => {
    if (!popups.length) return;
    const header = ['Title', 'User', 'Phone', 'Email', 'Purchase Plan', 'Message', 'Description'];
    const rows = popups.map(p => [
      p.title,
      p.username,
      p.phone,
      p.email,
      p.purchase_plan,
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

  const ITEMS_PER_PAGE = 20;
  const paginatedPopups = paginate(popups, currentPage, ITEMS_PER_PAGE);
  const totalPages = Math.ceil(popups.length / ITEMS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-64 bg-white"></div>
      <div className="flex-1 flex flex-col overflow-hidden"> 
        <div className="flex items-center justify-between w-full mb-7">
          <h1 className="text-3xl font-headline text-gray-800">Project Enquires</h1>
          <button onClick={handleExport} className="export-button">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 30 30" 
              width="20" 
              height="20" 
              className="text-green-600 font-headline group-hover:text-white"
            >
              <path 
                fill="currentColor" 
                d="M 15 3 A 2 2 0 0 0 14.599609 3.0429688 L 14.597656 3.0410156 L 4.6289062 5.0351562 L 4.6269531 5.0371094 A 2 2 0 0 0 3 7 L 3 23 A 2 2 0 0 0 4.6289062 24.964844 L 14.597656 26.958984 A 2 2 0 0 0 15 27 A 2 2 0 0 0 17 25 L 17 5 A 2 2 0 0 0 15 3 z M 19 5 L 19 8 L 21 8 L 21 10 L 19 10 L 19 12 L 21 12 L 21 14 L 19 14 L 19 16 L 21 16 L 21 18 L 19 18 L 19 20 L 21 20 L 21 22 L 19 22 L 19 25 L 25 25 C 26.105 25 27 24.105 27 23 L 27 7 C 27 5.895 26.105 5 25 5 L 19 5 z M 23 8 L 24 8 C 24.552 8 25 8.448 25 9 C 25 9.552 24.552 10 24 10 L 23 10 L 23 8 z M 6.1855469 10 L 8.5878906 10 L 9.8320312 12.990234 C 9.9330313 13.234234 10.013797 13.516891 10.091797 13.837891 L 10.125 13.837891 C 10.17 13.644891 10.258531 13.351797 10.394531 12.966797 L 11.785156 10 L 13.972656 10 L 11.359375 14.955078 L 14.050781 19.998047 L 11.716797 19.998047 L 10.212891 16.740234 C 10.155891 16.625234 10.089203 16.393266 10.033203 16.072266 L 10.011719 16.072266 C 9.9777187 16.226266 9.9105937 16.458578 9.8085938 16.767578 L 8.2949219 20 L 5.9492188 20 L 8.7324219 14.994141 L 6.1855469 10 z M 23 12 L 24 12 C 24.552 12 25 12.448 25 13 C 25 13.552 24.552 14 24 14 L 23 14 L 23 12 z M 23 16 L 24 16 C 24.552 16 25 16.448 25 17 C 25 17.552 24.552 18 24 18 L 23 18 L 23 16 z M 23 20 L 24 20 C 24.552 20 25 20.448 25 21 C 25 21.552 24.552 22 24 22 L 23 22 L 23 20 z"
              />
            </svg>
            Export Data
          </button>
        </div>
        <div className="flex-1 p-8">
          <div className="relative">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50 font-headline">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Purchase Plan</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPopups.length > 0 ? (
                  paginatedPopups.map((popup) => (
                    <tr key={popup.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-body text-gray-900">{popup.title}</td>
                      <td className="px-6 py-4">{popup.username}</td>
                      <td className="px-6 py-4">{popup.phone}</td>
                      <td className="px-6 py-4">{popup.purchase_plan}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleView(popup)}
                          className="action-button"
                        > 
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19C16.4183 19 20 12 20 12C20 12 16.4183 5 12 5C7.58172 5 4 12 4 12C4 12 7.58172 19 12 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View 
                        </button>
                        <DeletePopup
                          customTrigger={
                            <button className="action-button ">
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Delete
                            </button>
                          }
                          message={`Are you sure you want to delete the project enquiry "${popup.title}"?`}
                          itemId={popup.id}
                          onConfirm={() => handleDelete(popup.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                      No project popups available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                className={`pagination-page-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-button"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 bg-mainSlatenavy5 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-headline text-white">Project Enquires</h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 text-white rounded-full hover:bg-blue-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm text-gray-700">
              <div className="flex items-start space-x-4">
                <span className="w-24 font-body text-gray-500">Project:</span>
                <p className="text-gray-900">{selectedPopup.title ?? 'N/A'}</p>
              </div>

              <div className="flex items-start space-x-4">
                <span className="w-24 font-body text-gray-500">User:</span>
                <p className="text-gray-900">{selectedPopup.username ?? 'N/A'}</p>
              </div>

              <div className="flex items-start space-x-4">
                <span className="w-24 font-body text-gray-500">Phone:</span>
                <p className="text-gray-900">{selectedPopup.phone ?? 'N/A'}</p>
              </div>

              <div className="flex items-start space-x-4">
                <span className="w-24 font-body text-gray-500">Email:</span>
                <p className="text-gray-900">{selectedPopup.email ?? 'N/A'}</p>
              </div>

              <div className="flex items-start space-x-4">
                <span className="w-24 font-body text-gray-500">Plan:</span>
                <p className="text-gray-900">{selectedPopup.purchase_plan ?? 'N/A'}</p>
              </div>

              <div className="flex items-start space-x-4">
                <span className="w-24 font-body text-gray-500">Message:</span>
                <div>
                  <p className="text-gray-900">
                    {selectedPopup.message || 'No message provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}