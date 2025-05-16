import React, { useState } from 'react';
import axios from 'axios';
import { createBlogPost } from '../../services/blogService';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';

function BlogCreate() {
  const [formData, setFormData] = useState({
    title: '',
    meta_description: '',
    meta_keywords: '',
    description_1: '',
    description_2: '',
    description_3: '',
    slug: ''
  });

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login on logout
  };

  const [images, setImages] = useState({
    image_1: null,
    image_2: null,
    featured_image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setImages(prev => ({ ...prev, [name]: files[0] }));
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('files', imageFile);

    try {
      const response = await axios.post('http://localhost:1337/api/upload', formData);
      return response.data[0]; // Return uploaded file object
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') 
      .replace(/\s+/g, '-')         
      .replace(/-+/g, '-');          
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.meta_description || !formData.meta_keywords || !formData.slug) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Upload images
      const uploadedImage1 = await uploadImage(images.image_1);
      const uploadedImage2 = await uploadImage(images.image_2);
      const uploadedFeatured = await uploadImage(images.featured_image);

      // Prepare blog payload
      const payload = {
        title: formData.title,
        slug: formData.slug,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
        description_1: [
          { type: "paragraph", children: [{ type: "text", text: formData.description_1 }] },
        ],
        description_2: [
          { type: "paragraph", children: [{ type: "text", text: formData.description_2 }] },
        ],
        description_3: [
          { type: "paragraph", children: [{ type: "text", text: formData.description_3 }] },
        ],
        image_1: uploadedImage1?.id || null,
        image_2: uploadedImage2?.id || null,
        featured_image: uploadedFeatured?.id || null
      };

      const response = await createBlogPost(payload);
      console.log('Blog created:', response);
      alert('Blog created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      alert('Error creating blog. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} /> {/* Use the Sidebar component */}

      <div className="mx-24 mt-6">

        <h2 className="text-2xl font-semibold mb-4">Create Blog</h2>

        <form onSubmit={handleSubmit}>
          {/* Text Fields */}
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Slug</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData(prev => ({
                      ...prev,
                      slug: generateSlug(formData.title)
                    }))
                  }
                  className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Autogenerate
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Meta Description</label>
              <input type="text" name="meta_description" value={formData.meta_description} onChange={handleChange} required className="form-input" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Meta Keywords</label>
              <input type="text" name="meta_keywords" value={formData.meta_keywords} onChange={handleChange} required className="form-input" />
            </div>
          </div>

          {/* Descriptions */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Description 1</label>
              <textarea name="description_1" rows="3" value={formData.description_1} onChange={handleChange} className="form-textarea" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Description 2</label>
              <textarea name="description_2" rows="3" value={formData.description_2} onChange={handleChange} className="form-textarea" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Description 3</label>
              <textarea name="description_3" rows="3" value={formData.description_3} onChange={handleChange} className="form-textarea" />
            </div>
          </div>

          {/* File Uploads */}
          <div className="mb-6 grid gap-6 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Image 1</label>
              <input type="file" name="image_1" accept="image/*" onChange={handleImageChange} />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Image 2</label>
              <input type="file" name="image_2" accept="image/*" onChange={handleImageChange} />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Featured Image</label>
              <input type="file" name="featured_image" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default BlogCreate;
