import React, { useState } from 'react';
import axios from 'axios';
import { createBlogPost } from '../../services/blogService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BlogCreate() {
  const [formData, setFormData] = useState({
    title: '',
    description_1: '',
    description_2: '',
    description_3: '',
    meta_description: '',
    meta_keywords: '',
    alt_text_image: '',
    slug: '',
  });

  const [images, setImages] = useState({
    image_1: null,
    image_2: null,
    featured_image: null
  });

  const [publishData, setPublishData] = useState({
    publish: false,
    publishDate: '',
    publishTime: '',
  });

  const [activeTab, setActiveTab] = useState('content');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, field) => {
    setImages(prev => ({
      ...prev,
      [field]: e.target.files[0]
    }));
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await axios.post('http://localhost:1337/api/upload', formData);
      return response.data[0]?.id;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
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

     try {
    // Format the publish date
    const publishDateTime = publishData.publishDate && publishData.publishTime 
      ? `${publishData.publishDate}T${publishData.publishTime}:00` 
      : null;

    // Upload images
    const uploadedImages = {
      image_1: images.image_1 ? await uploadImage(images.image_1) : null,
      image_2: images.image_2 ? await uploadImage(images.image_2) : null,
      featured_image: images.featured_image ? await uploadImage(images.featured_image) : null
    };

    // Prepare payload with proper structure
    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Format the publish date
    const publishDateTime = publishData.publishDate && publishData.publishTime 
      ? `${publishData.publishDate}T${publishData.publishTime}:00` 
      : null;

    // Upload images
    const uploadedImages = {
      image_1: images.image_1 ? await uploadImage(images.image_1) : null,
      image_2: images.image_2 ? await uploadImage(images.image_2) : null,
      featured_image: images.featured_image ? await uploadImage(images.featured_image) : null
    };

    // Prepare payload with proper structure
    const payload = {
    title: formData.title,
    slug: formData.slug || generateSlug(formData.title),
    description_1: formData.description_1 ? [
      { type: "paragraph", children: [{ type: "text", text: formData.description_1 }] }
    ] : [],
    description_2: formData.description_2 ? [
      { type: "paragraph", children: [{ type: "text", text: formData.description_2 }] }
    ] : [],
    description_3: formData.description_3 ? [
      { type: "paragraph", children: [{ type: "text", text: formData.description_3 }] }
    ] : [],
    meta_description: formData.meta_description || "",
    meta_keywords: formData.meta_keywords || "",
    image_1: uploadedImages.image_1 || null,
    image_2: uploadedImages.image_2 || null,
    featured_image: uploadedImages.featured_image || null,
    alt_text_image: formData.alt_text_image || "",
    publish: publishData.publish || false,
    date: publishDateTime || null
  };

    // Make sure to wrap the payload in a data object if your API expects it
    const apiPayload = {
      data: payload
    };

    const response = await createBlogPost(apiPayload);
    console.log('Blog created:', response);
    toast.success('Blog created successfully!');
    navigate('/blogs');
  } catch (error) {
    console.error('Error creating blog:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      if (error.response.data.error?.details) {
        toast.error(`Validation error: ${error.response.data.error.message}`);
      } else {
        toast.error('Error creating blog. Please try again.');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
  }
};

      const response = await createBlogPost(payload);
      console.log('Blog created:', response);
      toast.success('Blog created successfully!');
      navigate('/blogs'); // Redirect after successful creation
    } catch (error) {
      console.error('Error creating blog:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      toast.error('Error creating blog. Please try again.');
    }
  };

  return (
    <div className="bg-white ml-64 p-6 font-sans">
      {/* Header */}
      <label className="flex justify-between items-start mb-2">Title</label>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={formData.title}
          onChange={handleChange}
          name="title"
          className="w-3/5 px-4 py-2 text-l font-body font-univers border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left */}
        <div className="lg:w-2/3 space-y-4">
          <div className="flex space-x-6 border-b font-headline border-gray-300 pb-2">
            <button 
              className={`pb-1 font-semibold ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button 
              className={`pb-1 font-semibold ${activeTab === 'meta' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setActiveTab('meta')}
            >
              Meta
            </button>
          </div>

          {activeTab === 'content' && (
            <>
              {/* Description 1 with Image 1 */}
              <div className="bg-white p-5 rounded shadow">
                <h2 className="text-l font-headline mb-2">Section 1</h2>
                <textarea
                  name="description_1"
                  value={formData.description_1 || ''}
                  onChange={handleChange}
                  className="w-full font-body h-32 border border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Enter your first description here..."
                ></textarea>
                
                <h3 className="text-md font-headline mb-2">Image 1</h3>
                <div className="border-2 font-headline border-dashed border-gray-300 rounded p-4 text-center text-blue-600 cursor-pointer mb-3">
                  <input
                    type="file"
                    name="image_1"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'image_1')}
                    className="hidden font-body"
                    id="file-upload-image_1"
                  />
                  <label htmlFor="file-upload-image_1" className="cursor-pointer">
                    Upload Image 1
                  </label>
                </div>
              </div>

              {/* Description 2 with Image 2 */}
              <div className="bg-white p-5 rounded shadow">
                <h2 className="text-l font-headline mb-2">Section 2</h2>
                <textarea
                  name="description_2"
                  value={formData.description_2 || ''}
                  onChange={handleChange}
                  className="w-full h-32 border font-body border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Enter your second description here..."
                ></textarea>
                
                <h3 className="text-md font-medium mb-2">Image 2</h3>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-blue-600 cursor-pointer mb-3">
                  <input
                    type="file"
                    name="image_2"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'image_2')}
                    className="hidden"
                    id="file-upload-image_2"
                  />
                  <label htmlFor="file-upload-image_2" className="cursor-pointer">
                    Upload Image 2
                  </label>
                </div>
              </div>

              {/* Description 3 */}
              <div className="bg-white p-5 rounded shadow">
                <h2 className="text-l font-headline mb-2">Section 3</h2>
                <textarea
                  name="description_3"
                  value={formData.description_3 || ''}
                  onChange={handleChange}
                  className="w-full font-body h-32 border border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Enter your third description here..."
                ></textarea>
              </div>

              {/* Featured Image and Alt Text */}
              <div className="bg-white p-5 rounded shadow">
                <h2 className="text-l font-headline mb-2">Featured Image</h2>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-blue-600 cursor-pointer mb-4">
                  <input
                    type="file"
                    name="featured_image"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'featured_image')}
                    className="hidden"
                    id="file-upload-featured"
                  />
                  <label htmlFor="file-upload-featured" className="cursor-pointer">
                    Upload Featured Image
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-headline mb-1">Alt Text for Images</label>
                  <input
                    type="text"
                    placeholder="Enter alt text for all images"
                    name="alt_text_image"
                    value={formData.alt_text_image || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border font-body border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'meta' && (
            <div className="bg-white p-5 rounded shadow space-y-4">
              <div>
                <label className="block text-sm font-headline mb-1">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 font-body border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-headline mb-1">Meta Keywords</label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border font-body border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center space-x-3">
              <img
                src="https://i.pravatar.cc/40"
                className="w-10 h-10 rounded-full"
                alt="Author"
              />
              <div>
                <span className="font-headline block">Admin User</span>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <label className="block text-sm font-headline mb-1">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-2 border font-body border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                slug: generateSlug(formData.title)
              }))}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Generate from Title
            </button>
          </div>

          {/* Publish Settings */}
          <div className="bg-white p-4 rounded shadow">
            <div className="border-t pt-4">
              <h3 className="font-headline mb-2">Publish Settings</h3>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm">Published Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={publishData.publish}
                    onChange={() => setPublishData(prev => ({
                      ...prev,
                      publish: !prev.publish
                    }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={publishData.publishDate}
                    onChange={(e) => setPublishData(prev => ({
                      ...prev,
                      publishDate: e.target.value
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Publish Time</label>
                  <input
                    type="time"
                    value={publishData.publishTime}
                    onChange={(e) => setPublishData(prev => ({
                      ...prev,
                      publishTime: e.target.value
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>

              {publishData.publishDate && (
                <div className="mt-2 text-xs text-gray-500">
                  Scheduled for: {new Date(`${publishData.publishDate}T${publishData.publishTime}`).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default BlogCreate;