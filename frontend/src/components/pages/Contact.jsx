import { useState ,useEffect } from 'react';
import { fetchContactList } from '../../services/contactService';

function Contact() {
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    terms: false,
    termsaved: 'rejected',
  });

 
 useEffect(() => {
      const fetchContact = async () => {
        try {
          const data = await fetchContactList();
          setFormData(data);
        } catch (error) {
          // Already logged inside service
        } finally {
          setLoading(false);
        }
      };
  
      fetchContact();
    }, []);

  // Submit user form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:1337/api/userdetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });

      const result = await response.json();
      console.log('Server Response:', result);

      if (response.ok) {
        alert('Form submitted successfully!');
      } else {
        alert(`Error: ${result.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again later.');
    }
  };

  return (
    <>
     
      {/* User Form */}
      <div className="container mx-auto max-w-md p-6 bg-blue-200 rounded shadow-md mt-10">
        <h2 className="text-xl font-bold mb-4">User Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border p-2 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border p-2 rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="terms"
              className="mr-2"
              checked={formData.terms}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFormData({
                  ...formData,
                  terms: isChecked,
                  termsaved: isChecked ? 'accepted' : 'rejected',
                });
              }}
            />
            <label className="font-semibold">Check your data</label>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Contact;
