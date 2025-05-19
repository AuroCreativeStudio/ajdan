import React, { useEffect, useState } from 'react';
import { fetchContactList } from '../../services/contactService';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
import { paginate } from '../../services/paginate';

const ITEMS_PER_PAGE = 10; // Adjust as needed
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

  // Export data as CSV
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
  };

  const paginatedContacts = paginate(contactLists, currentPage, ITEMS_PER_PAGE);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Contact List</h2>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Export Data
          </button>
        </div>
        {contactLists.length === 0 ? (
          <p>No contact data found.</p>
        ) : (
          <>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  {/* <th className="px-4 py-2 border-b">Phone</th>
                  <th className="px-4 py-2 border-b">Message</th> */}
                  <th className="px-4 py-2 border-b">Terms</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((contact, index) => (
                  <tr key={contact.id || index}>
                    <td className="px-4 py-2 border-b">{contact.name}</td>
                    <td className="px-4 py-2 border-b">{contact.email}</td>
                    {/* <td className="px-4 py-2 border-b">{contact.phone}</td>
                    <td className="px-4 py-2 border-b">{contact.message}</td> */}
                    <td className="px-4 py-2 border-b">{contact.terms ? 'Accepted' : 'Rejected'}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => handleView(contact)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
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
          </>
        )}

        {/* Modal */}
        {showModal && selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="p-6 bg-white rounded-lg shadow-md w-96">
              <h3 className="mb-4 text-lg font-semibold">Contact Details</h3>
              <p className="mb-2 text-gray-700"><strong>ID:</strong> {selectedContact.id}</p>
              <p className="mb-2 text-gray-700"><strong>Name:</strong> {selectedContact.name}</p>
              <p className="mb-2 text-gray-700"><strong>Email:</strong> {selectedContact.email}</p>
              <p className="mb-2 text-gray-700"><strong>Phone:</strong> {selectedContact.phone}</p>
              <p className="mb-2 text-gray-700"><strong>Message:</strong> {selectedContact.message}</p>
              <p className="mb-4 text-gray-700"><strong>Terms:</strong> {selectedContact.terms ? 'Accepted' : 'Rejected'}</p>

              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-700"
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
