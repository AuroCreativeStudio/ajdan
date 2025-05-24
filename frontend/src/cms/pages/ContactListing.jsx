import React, { useEffect, useState } from 'react';
import { fetchContactList } from '../../services/contactService';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
import { paginate } from '../../services/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 10;

function ContactListing() {
  const [contactLists, setContactLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await fetchContactList();
        setContactLists(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Error fetching contact list:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, []);

  const handleView = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  const handleExport = () => {
    if (!contactLists.length) return;
    const header = ['Name', 'Email', 'Phone', 'Message', 'Terms'];
    const rows = contactLists.map(c => [
      c.name, c.email, c.phone, c.message, c.terms ? 'Accepted' : 'Rejected'
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.map(val => `"${val ?? ''}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact-list.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Contact list exported successfully!');
  };

  const paginatedContacts = paginate(contactLists, currentPage, ITEMS_PER_PAGE);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r border-gray-200">
        <Sidebar handleLogout={handleLogout} />
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between w-full mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Contact List</h1>
          <button
            className="p-2 mr-4 text-white bg-green-600 border rounded-md border-1 hover:bg-green-700"
            onClick={handleExport}
          >
            Export Data
          </button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Terms</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : contactLists && contactLists.length > 0 ? (
                paginatedContacts.map((contact, idx) => (
                  <tr key={contact.id || idx} className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4">{contact.name}</td>
                    <td className="px-6 py-4">{contact.email}</td>
                    <td className="px-6 py-4">{contact.terms ? 'Accepted' : 'Rejected'}</td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        onClick={() => handleView(contact)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                    No contact data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex mt-4 space-x-2">
          {Array.from({ length: Math.ceil(contactLists.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
        </div>
        <ToastContainer />

{showModal && selectedContact && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg">
      
      {/* Modal Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Contact Details</h3>
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

      {/* Modal Body - Column Layout */}
      <div className="p-6 space-y-4 text-sm text-gray-700">
        
        {/* <div>
          <span className="font-medium text-gray-500">ID:</span>
          <p className="text-gray-900">{selectedContact.id ?? 'N/A'}</p>
        </div> */}

       

        <div>
          <span className="font-medium text-gray-500">Name:</span>
          <p className="text-gray-900">{selectedContact.name ?? 'N/A'}</p>
        </div>

        <div>
          <span className="font-medium text-gray-500">Email:</span>
          <p className="text-gray-900 break-all">{selectedContact.email ?? 'N/A'}</p>
        </div>

        <div>
          <span className="font-medium text-gray-500">Phone:</span>
          <p className="text-gray-900">{selectedContact.phone ?? 'N/A'}</p>
        </div>

        <div>
          <span className="font-medium text-gray-500">Message:</span>
          <p className="text-gray-900 whitespace-pre-wrap">
            {selectedContact.message || 'No message provided'}
          </p>
        </div>
         <div>
          <span className="font-medium text-gray-500">Terms:</span>
          <p>
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
              selectedContact.terms ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {selectedContact.terms ? 'Accepted' : 'Rejected'}
            </span>
          </p>
        </div>

      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 text-right bg-gray-100">
        <button
          onClick={handleCloseModal}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}

export default ContactListing;