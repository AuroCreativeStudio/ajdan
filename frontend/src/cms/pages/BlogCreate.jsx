import React, { useState } from 'react';
import { createBlogPost } from '../../services/blogService';

function BlogCreate() {
  const [formData, setFormData] = useState({
    title: '',
   
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await createBlogPost(data);
      console.log('Blog created:', response.data);
      alert('Blog created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog.');
    }
  };

  return (
    <>
      <div className="text-2xl font-semibold ml-24 mt-4 mb-4">Create Blog</div>
      <form onSubmit={handleSubmit} className="mx-24">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                         focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                       hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
                       font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-8"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default BlogCreate;
