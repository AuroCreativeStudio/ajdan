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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const convertToBlock = (text) => {
    if (!text || typeof text !== 'string') return [];
    return text
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => ({
        type: 'paragraph',
        children: [{ type: 'text', text: line }],
      }));
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await axios.post(
        'http://localhost:1337/api/upload', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          timeout: 30000
        }
      );
      return response.data[0]?.id;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    
    if (!formData.title) throw new Error('Title is required');

    // Format date-time
    let formattedDate = new Date().toISOString();
    if (publishData.publishDate && publishData.publishTime) {
      formattedDate = `${publishData.publishDate}T${publishData.publishTime}:00.000Z`;
    }

    // Upload images
    const [image1Id, image2Id, featuredImageId] = await Promise.all([
      images.image_1 ? uploadImage(images.image_1) : Promise.resolve(null),
      images.image_2 ? uploadImage(images.image_2) : Promise.resolve(null),
      images.featured_image ? uploadImage(images.featured_image) : Promise.resolve(null),
    ].map(p => p.catch(e => {
      console.error('Image upload failed:', e.message);
      return null;
    })));

    // Prepare payload according to your schema
    const payload = {
      data: {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description_1: convertToBlock(formData.description_1),
        description_2: convertToBlock(formData.description_2),
        description_3: convertToBlock(formData.description_3),
        meta_description: formData.meta_description || '',
        meta_keywords: formData.meta_keywords || '',
        alt_text_image: formData.alt_text_image || '',
        date: formattedDate, // Use the formatted date
       
        publish: publishData.publish, // Use the publish toggle status
        image_1: image1Id,
        image_2: image2Id,
        featured_image: featuredImageId
      }
    };

    console.log("Final payload:", JSON.stringify(payload, null, 2));

    // Send API request
    const response = await createBlogPost(payload);
    console.log(response);
    toast.success('Blog created successfully!');
    navigate('/bloglist');
  } catch (error) {
    console.error('Error in handleSubmit:', error);
       console.error('Full error:', error);
    console.error('Error response:', error.response?.data); 
    toast.error(`Error: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="bg-white ml-64 p-6 font-sans">
      {/* Header */}
      <label className="flex justify-between items-start font-headline mb-2">Title</label>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={formData.title}
          onChange={handleChange}
          name="title"
          className="w-3/5 px-4 py-2 text-l font-body font-univers border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mainCharcoal1"
        />
        <div className="flex items-center space-x-3">
          <button
            className={`export-button ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left */}
        <div className="lg:w-2/3 space-y-4">
          <div className="flex space-x-6 border-b font-headline border-gray-300 pb-2">
            <button 
              className={`pb-1 font-headline ${activeTab === 'content' ? 'text-mainCharcoal1 border-b-2 border-mainCharcoal1' : 'text-gray-500 hover:text-mainCharcoal1'}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button 
              className={`pb-1 font-headline ${activeTab === 'meta' ? 'text-mainCharcoal1 border-b-2 border-mainCharcoal1' : 'text-gray-500 hover:text-mainCharcoal1'}`}
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
                  className="w-full font-univers font-body  h-32 border border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-mainCharcoal1 mb-4"
                  placeholder="Enter your first description here..."
                ></textarea>
                
                <h3 className="text-md font-headline mb-2">Image 1</h3>
                <div className="border-2 font-headline border-dashed border-gray-300 rounded p-4 text-center text-mainCharcoal1 cursor-pointer mb-3">
                  <input
                    type="file"
                    name="image_1"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'image_1')}
                    className="hidden font-body"
                    id="file-upload-image_1"
                  />
                  <label htmlFor="file-upload-image_1" className="cursor-pointer">
                    {images.image_1 ? images.image_1.name : 'Upload Image 1'}
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
                  className="w-full h-32 border font-body font-univers border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-mainCharcoal1 mb-4"
                  placeholder="Enter your second description here..."
                ></textarea>
                
                <h3 className="text-md font-medium mb-2">Image 2</h3>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-mainCharcoal1 cursor-pointer mb-3">
                  <input
                    type="file"
                    name="image_2"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'image_2')}
                    className="hidden"
                    id="file-upload-image_2"
                  />
                  <label htmlFor="file-upload-image_2" className="cursor-pointer">
                    {images.image_2 ? images.image_2.name : 'Upload Image 2'}
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
                  className="w-full font-body font-univers h-32 border border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-mainCharcoal1 mb-4"
                  placeholder="Enter your third description here..."
                ></textarea>
              </div>

              {/* Featured Image and Alt Text */}
              <div className="bg-white p-5 rounded shadow">
                <h2 className="text-l font-headline mb-2">Featured Image</h2>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-mainCharcoal1 cursor-pointer mb-4">
                  <input
                    type="file"
                    name="featured_image"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'featured_image')}
                    className="hidden"
                    id="file-upload-featured"
                  />
                  <label htmlFor="file-upload-featured" className="cursor-pointer">
                    {images.featured_image ? images.featured_image.name : 'Upload Featured Image'}
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
                    className="w-full px-3 py-2 border font-body border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mainCharcoal1"
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
                  className="w-full px-3 py-2 font-body font-univers border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mainCharcoal1"
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
                  className="w-full px-3 py-2 border font-body font-univers border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mainCharcoal1"
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
              className="w-full px-3 py-2 mb-2 border font-body font-univers border-gray-300 rounded"
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
                <span className="text-sm font-headline">Published Status</span>
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
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accentSagegray2"></div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-headline">Publish Date</label>
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
                  <label className="block text-xs text-gray-500 mb-1 font-headline">Publish Time</label>
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