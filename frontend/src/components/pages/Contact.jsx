'use client';
import { useState } from 'react';
import { postContactDetails } from '../../services/contactService';
import { Switch } from '@headlessui/react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    terms: false,
    termsaved: 'rejected',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message, terms } = formData;

    if (!name || !email || !phone || !message || !terms) {
      alert('Please fill in all fields and accept the terms.');
      return;
    }

    try {
      const { termsaved, ...payload } = formData;
      const result = await postContactDetails(payload);
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
      alert(`Error: ${error.response?.data?.error?.message || error.message || 'Something went wrong.'}`);
    }
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Contact Us</h2>
        <p className="mt-2 text-lg text-gray-600">Reach out to us for any inquiries or support.</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            ></textarea>
          </div>
        </div>

        <div className="mt-10">
          <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
            <Switch
              checked={formData.terms}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  terms: value,
                  termsaved: value ? 'accepted' : 'rejected',
                }))
              }
              className={`${
                formData.terms ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span
                className={`${
                  formData.terms ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <Switch.Label className="text-sm text-gray-600">
              By selecting this, you agree to our{' '}
              <a href="#" className="font-semibold text-indigo-600">
                privacy&nbsp;policy
              </a>
              .
            </Switch.Label>
          </Switch.Group>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
      {/* Map Section */}
      <div className="container flex flex-wrap gap-10 mx-auto lg:flex-nowrap mt-16">
        {/* Left Section - Map */}
        <div className="w-full p-0 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
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
      </div>
    </div>
  );
}