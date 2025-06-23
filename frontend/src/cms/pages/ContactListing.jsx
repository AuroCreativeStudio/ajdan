import React, { useEffect, useState } from 'react';
import { fetchContactList, deleteContactDetail } from '../../services/contactService';
import { useNavigate } from 'react-router-dom';
import { paginate } from '../../services/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeletePopup from './DeletePopup';

const ITEMS_PER_PAGE = 20; // Changed from 10 to 20 to match your pageSize

function ContactListing() {
  const [contactLists, setContactLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const paginatedContacts = paginate(contactLists, currentPage, ITEMS_PER_PAGE);
  const totalPages = Math.ceil(contactLists.length / ITEMS_PER_PAGE);

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
  
  
  const handleDelete = async (contactId) => {
    try {
      await deleteContactDetail(contactId);
      toast.success("Contact deleted successfully");
      setContactLists(prev => prev.filter(contact => contact.documentId !== contactId));
    
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      toast.error("Failed to delete contact");
    }
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

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
   <div className="flex h-screen bg-white">
      <div className="w-64 bg-white"></div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between w-full p-6">
          <h1 className="text-3xl text-gray-800 font-headline">Contact List</h1>
          <button onClick={handleExport} className="export-button">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 30 30" 
              width="20" 
              height="20" 
              className="text-green-600 group-hover:text-white font-headline"
            >
              <path 
                fill="currentColor" 
                d="M 15 3 A 2 2 0 0 0 14.599609 3.0429688 L 14.597656 3.0410156 L 4.6289062 5.0351562 
                L 4.6269531 5.0371094 A 2 2 0 0 0 3 7 L 3 23 A 2 2 0 0 0 4.6289062 24.964844 L 14.597656 26.958984 A 2 2 0 0 0 15 27 A 2 2 0 0 0 17 25 L
                17 5 A 2 2 0 0 0 15 3 z M 19 5 L 19 8 L 21 8 L 21 10 L 19 10 L 19 12 L 21 12 L 21 14 L 19 14 L 19 16 L 21 16 L 21 18 L 19 18 L 19 20 L 21 20 L 21 22 L 19 22 L 19 25
                L 25 25 C 26.105 25 27 24.105 27 23 L 27 7 C 27 5.895 26.105 5 25 5 L 19 5 z M 23 8 L 24 8 C 24.552 8 25 8.448 25 9 C 25 9.552 24.552 10 24 10 L 23 10 L 23 8 z M 6.1855469 
                10 L 8.5878906 10 L 9.8320312 12.990234 C 9.9330313 13.234234 10.013797 13.516891 10.091797 13.837891 L 10.125 13.837891 C 10.17 13.644891 10.258531 13.351797
                10.394531 12.966797 L 11.785156 10 L 13.972656 10 L 11.359375 14.955078 L 14.050781 19.998047 L 11.716797 19.998047 L 10.212891 16.740234 C 10.155891 16.625234 
                10.089203 16.393266 10.033203 16.072266 L 10.011719 16.072266 C 9.9777187 16.226266 9.9105937 16.458578 9.8085938 16.767578 L 8.2949219 20 L 5.9492188 20 L 8.7324219
                14.994141 L 6.1855469 10 z M 23 12 L 24 12 C 24.552 12 25 12.448 25 13 C 25 13.552 24.552 14 24 14 L 23 14 L 23 12 z M 23 16 L 24 16 C 24.552 16 25 16.448 25 17 C 25 
                17.552 24.552 18 24 18 L 23 18 L 23 16 z M 23 20 L 24 20 C 24.552 20 25 20.448 25 21 C 25 21.552 24.552 22 24 22 L 23 22 L 23 20 z"
              />
            </svg>
            Export Data
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 pb-4">
          <div className="bg-white rounded-lg shadow-sm">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-headline">
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
                    <tr key={contact.id || idx} className="bg-white border-b font-body border-gray-200">
                      <td className="px-6 py-4">{contact.name}</td>
                      <td className="px-6 py-4">{contact.email}</td>
                      <td className="px-6 py-4">{contact.terms ? 'Accepted' : 'Rejected'}</td>
                      <td className="px-6 py-4">
                        <button
                          className="action-button"
                          onClick={() => handleView(contact)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19C16.4183 19 20 12 20 12C20 12 16.4183 5 12 5C7.58172 5 4 12 4 12C4 12 7.58172 19 12 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View 
                        </button>
                        <DeletePopup
                          customTrigger={
                            <button className="action-button ml-2">
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"/>
                              </svg>
                              Delete
                            </button>
                          }
                          message={`Are you sure you want to delete the contact "${contact.name}"?`}
                          itemId={contact.documentId}
                          onConfirm={() => handleDelete(contact.documentId)}
                        />
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
        </div>
        
        {/* Pagination */}
        <div className="pagination-container ">
          <button
            className="pagination-button "
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
                onClick={() => goToPage(page)}
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

        <ToastContainer />

        {showModal && selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden bg-white rounded-lg shadow-lg">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-mainSlatenavy5">
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

              {/* Modal Body */}
              <div className="p-6 space-y-6 text-sm text-gray-700">
                {/* Name */}
                <div className="flex items-start space-x-4">
                  <span className="w-24 font-medium text-gray-500">Name:</span>
                  <p className="text-gray-900">{selectedContact.name ?? 'N/A'}</p>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <span className="w-24 font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900 break-all">{selectedContact.email ?? 'N/A'}</p>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <span className="w-24 font-medium text-gray-500">Phone:</span>
                  <p className="text-gray-900">{selectedContact.phone ?? 'N/A'}</p>
                </div>

                {/* Message - with extra spacing */}
                <div className="flex items-start space-x-4">
                  <span className="w-24 font-medium text-gray-500">Message:</span>
                  <div>
                    <p className="text-gray-900">
                      {selectedContact.message || 'No message provided'}
                    </p>
                  </div>
                </div>
                
                {/* Terms */}
                <div className="flex items-center space-x-4">
                  <span className="w-24 font-medium text-gray-500">Terms:</span>
                  <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                    selectedContact.terms ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedContact.terms ? 'Accepted' : 'Rejected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactListing;