import { useState } from 'react';
import {postContactDetails} from '../../services/contactService';
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone:'',
    message:'',
    terms: false,
   
  });

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
      termsaved: name === 'terms' ? (fieldValue ? 'accepted' : 'rejected') : prevData.termsaved,
    }));
  };
console.log('Sending to Strapi:', { data: formData });

 const handleSubmit = async (e) => {
  e.preventDefault();

  const { name, email, phone, message, terms } = formData;

  // Frontend validation
  if (!name || !email || !phone || !message || !terms) {
    alert('Please fill in all fields and accept the terms.');
    return;
  }

  try {
    const { termsaved, ...payload } = formData;
    console.log('Request Payload:', { data: payload });

    const result = await postContactDetails(payload);

    console.log('Server Response:', result);
    alert('Form submitted successfully!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      terms: false,
      termsaved: 'rejected',
    });
  } catch (error) {
    console.error('Error submitting form:', error.response?.data || error);
    alert(`Error: ${error.response?.data?.error?.message || error.message || 'Something went wrong.'}`);
  }
};


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div
        className="relative w-full bg-center bg-cover h-80"
        style={{ backgroundImage: "url('/your-image-path.jpg')" }} // Replace with actual image path
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">Contact Us</h1>
            <p className="mt-2 text-lg">
              <span className="text-blue-400">Home</span> » Contact Us
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container flex flex-wrap gap-10 mx-auto lg:flex-nowrap">
          {/* Left Section - Map */}
          <div className="w-full p-0 rounded-lg overflow-hidden bg-gray-200 lg:w-1/3 flex items-center justify-center">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353159048!3d-37.8162797420217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f6e9b1%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1715700000000!5m2!1sen!2sus"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Right Section - User Form */}
          <div className="bg-blue-200 rounded-lg gap-8 shadow-md p-8 max-w- mx-auto lg:mx-0 lg:w-2/3">
            <h2 className="mb-4 text-xl font-bold ">User Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div className="mx-12">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-fu border p-2 rounded"
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

               <div>
                <label className="block font-semibold mb-1">PhoneNo</label>
                <input
                  type="phone"
                  name="phone"
                  className="w-full border p-2 rounded"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

                 <div>
                <label className="block font-semibold mb-1">Message</label>
                <textarea
                  type="message"
                  name="message"
                  className="w-full border p-2 rounded"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
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
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;