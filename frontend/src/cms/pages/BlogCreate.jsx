import React, { useState } from 'react';
import axios from 'axios';
import { createBlogPost } from '../../services/blogService';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.success('Blog created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      toast.error('Error creating blog. Please try again.');
    }
  };

  return (
 <div className="flex min-h-screen bg-gray-100">
  <Sidebar handleLogout={handleLogout} />
  
  <div className="flex-grow p-6">
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Create News</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Slug</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    slug: generateSlug(formData.title)
                  }))
                }
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Meta Description</label>
            <input 
              type="text" 
              name="meta_description" 
              value={formData.meta_description} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Meta Keywords</label>
            <input 
              type="text" 
              name="meta_keywords" 
              value={formData.meta_keywords} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Description 1</label>
            <textarea 
              name="description_1" 
              rows="4" 
              value={formData.description_1} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Description 2</label>
            <textarea 
              name="description_2" 
              rows="4" 
              value={formData.description_2} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Description 3</label>
            <textarea 
              name="description_3" 
              rows="4" 
              value={formData.description_3} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Image 1</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                  Choose File
                </span>
                <input 
                  type="file" 
                  name="image_1" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden"
                />
              </label>
              {formData.image_1 && (
                <span className="text-sm text-gray-500 truncate">{formData.image_1.name}</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Image 2</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                  Choose File
                </span>
                <input 
                  type="file" 
                  name="image_2" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden"
                />
              </label>
              {formData.image_2 && (
                <span className="text-sm text-gray-500 truncate">{formData.image_2.name}</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Featured Image</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                  Choose File
                </span>
                <input 
                  type="file" 
                  name="featured_image" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden"
                />
              </label>
              {formData.featured_image && (
                <span className="text-sm text-gray-500 truncate">{formData.featured_image.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Create Blog
          </button>
        </div>
      </form>
    </div>
    <ToastContainer position="bottom-right" />
  </div>
</div>
  );
}

export default BlogCreate;
