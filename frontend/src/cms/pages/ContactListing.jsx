import React, { useEffect, useState } from 'react';
import { fetchContactList } from '../../services/contactService';

function ContactListing() {
  const [contactLists, setContactLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

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

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contact List</h2>
      {contactLists.length === 0 ? (
        <p>No contact data found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              {/* <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Message</th> */}
              <th className="py-2 px-4 border-b">Terms</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {contactLists.map((contact, index) => (
              <tr key={contact.id || index}>
                <td className="py-2 px-4 border-b">{contact.name}</td>
                <td className="py-2 px-4 border-b">{contact.email}</td>
                {/* <td className="py-2 px-4 border-b">{contact.phone}</td>
                <td className="py-2 px-4 border-b">{contact.message}</td> */}
                <td className="py-2 px-4 border-b">{contact.terms ? 'Accepted' : 'Rejected'}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleView(contact)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
            <p className="text-gray-700 mb-2"><strong>ID:</strong> {selectedContact.id}</p>
            <p className="text-gray-700 mb-2"><strong>Name:</strong> {selectedContact.name}</p>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> {selectedContact.email}</p>
            <p className="text-gray-700 mb-2"><strong>Phone:</strong> {selectedContact.phone}</p>
            <p className="text-gray-700 mb-2"><strong>Message:</strong> {selectedContact.message}</p>
            <p className="text-gray-700 mb-4"><strong>Terms:</strong> {selectedContact.terms ? 'Accepted' : 'Rejected'}</p>

            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactListing;
