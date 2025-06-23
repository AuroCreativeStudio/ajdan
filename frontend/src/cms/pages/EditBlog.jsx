import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchBlogBySlug, updateBlog } from '../../services/blogService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:1337/';

const EditBlog = () => {
  const location = useLocation();
  const slug = location.state?.slug;
  const [language, setLanguage] = useState(location.state?.activeTab || 'en');
  const [activeTab, setActiveTab] = useState('content');
  const navigate = useNavigate();
  
  // Publish data state
  const [publishData, setPublishData] = useState({
    publish: false,
    publishDate: '',
    publishTime: '',
  });

  // English form data
  const [formData, setFormData] = useState({
    title: '',
    description_1: '',
    description_2: '',
    description_3: '',
    meta_description: '',
    meta_keywords: '',
    alt_text_image: '',
    slug: '',
    image_1: null,
    image_2: null,
    featured_image: null,
  });

  // Arabic form data
  const [formDataAr, setFormDataAr] = useState({
    title: '',
    description_1: '',
    description_2: '',
    description_3: '',
    meta_description: '',
    meta_keywords: '',
    alt_text_image: '',
    slug: '',
  });

  const [existingImages, setExistingImages] = useState({
    image_1: null,
    image_2: null,
    featured_image: null,
  });

  const [existingImageIds, setExistingImageIds] = useState({
    image_1: null,
    image_2: null,
    featured_image: null,
  });

  const [loading, setLoading] = useState(true);
  const [blogId, setBlogId] = useState(null);
  const [arabicBlogId, setArabicBlogId] = useState(null);

  const extractText = (content) => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    
    if (Array.isArray(content)) {
      return content.map(block => {
        if (block.type === 'paragraph' && block.children) {
          return block.children.map(child => child.text).join('');
        }
        if (block.type === 'heading' && block.children) {
          return block.children.map(child => child.text).join('') + '\n';
        }
        if (block.type === 'list' && block.children) {
          return block.children.map(child => 
            child.children.map(item => item.text).join('')
          ).join('\n• ');
        }
        return '';
      }).join('\n\n');
    }
    
    if (content && content.blocks) {
      return content.blocks.map(block => block.text).join('\n\n');
    }
    
    return '';
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

  useEffect(() => {
  const fetchData = async () => {
    if (!slug) {
      console.error("No slug provided");
      setLoading(false);
      return;
    }

    try {
      // Fetch English blog
      const blog = await fetchBlogBySlug(slug, 'en');
      if (!blog) {
        setLoading(false);
        toast.error('Blog not found!');
        return;
      }
      
      console.log("Fetched blog data:", blog);
      setBlogId(blog.documentId);
      
      // Parse the date field if it exists
      const blogDate = blog.date ? new Date(blog.date) : null;
      
      // Set publish data
      setPublishData({
        publish: blog.publish || false, // Use the publish field from API
        publishDate: blogDate ? blogDate.toISOString().split('T')[0] : '',
        publishTime: blogDate ? 
          `${String(blogDate.getHours()).padStart(2, '0')}:${String(blogDate.getMinutes()).padStart(2, '0')}`
          : ''
      });
        setFormData({
          title: blog.title || '',
          description_1: blog.description_1 ? extractText(blog.description_1) : '',
          description_2: blog.description_2 ? extractText(blog.description_2) : '',
          description_3: blog.description_3 ? extractText(blog.description_3) : '',
          meta_description: blog.meta_description || '',
          meta_keywords: blog.meta_keywords || '',
          alt_text_image: blog.alt_text_image || '',
          slug: blog.slug || '',
          image_1: null,
          image_2: null,
          featured_image: null,
        });

        setExistingImages({
          image_1: blog.image_1?.url
            ? blog.image_1.url.startsWith('http')
              ? blog.image_1.url
              : `${API_URL.replace(/\/$/, '')}/${blog.image_1.url.replace(/^\//, '')}`
            : null,
          image_2: blog.image_2?.url
            ? blog.image_2.url.startsWith('http')
              ? blog.image_2.url
              : `${API_URL.replace(/\/$/, '')}/${blog.image_2.url.replace(/^\//, '')}`
            : null,
          featured_image: blog.featured_image?.url
            ? blog.featured_image.url.startsWith('http')
              ? blog.featured_image.url
              : `${API_URL.replace(/\/$/, '')}/${blog.featured_image.url.replace(/^\//, '')}`
            : null,
        });

        setExistingImageIds({
          image_1: blog.image_1?.id || null,
          image_2: blog.image_2?.id || null,
          featured_image: blog.featured_image?.id || null,
        });

        // Fetch Arabic localization if exists
        if (blog.localizations && blog.localizations.length > 0) {
          const arabicBlog = blog.localizations.find(loc => loc.locale === 'ar');
          if (arabicBlog) {
            setArabicBlogId(arabicBlog.documentId);
            
            setFormDataAr({
              title: arabicBlog.title || '',
              description_1: arabicBlog.description_1 ? extractText(arabicBlog.description_1) : '',
              description_2: arabicBlog.description_2 ? extractText(arabicBlog.description_2) : '',
              description_3: arabicBlog.description_3 ? extractText(arabicBlog.description_3) : '',
              meta_description: arabicBlog.meta_description || '',
              meta_keywords: arabicBlog.meta_keywords || '',
              alt_text_image: arabicBlog.alt_text_image || '',
              slug: arabicBlog.slug || '',
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch blog:', error);
        toast.error('Failed to load blog data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleChange = (e, locale = 'en') => {
    const { name, value } = e.target;
    if (locale === 'en') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormDataAr(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.files[0]
    }));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch(`${API_URL}api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data[0]?.id;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    // 1. Handle image uploads first
    const uploadedImages = {};
    if (formData.image_1) uploadedImages.image_1 = await uploadImage(formData.image_1);
    if (formData.image_2) uploadedImages.image_2 = await uploadImage(formData.image_2);
    if (formData.featured_image) uploadedImages.featured_image = await uploadImage(formData.featured_image);

    // 2. Prepare payload for Strapi v4
    const payload = {
      data: {
        title: formData.title,
        slug: formData.slug,
        description_1: convertToBlock(formData.description_1),
        description_2: convertToBlock(formData.description_2),
        description_3: convertToBlock(formData.description_3),
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
        alt_text_image: formData.alt_text_image,
        publish: publishData.publish,
        date: publishData.publishDate ? `${publishData.publishDate}T${publishData.publishTime || '00:00'}:00.000Z` : null,
        // Handle images - use new IDs if uploaded, otherwise keep existing
        image_1: uploadedImages.image_1 ? { id: uploadedImages.image_1 } : existingImageIds.image_1,
        image_2: uploadedImages.image_2 ? { id: uploadedImages.image_2 } : existingImageIds.image_2,
        featured_image: uploadedImages.featured_image ? { id: uploadedImages.featured_image } : existingImageIds.featured_image
      }
    };

    // 3. Make the API call
    await updateBlog(blogId, payload, 'en');

    // 4. Handle Arabic localization if exists
    if (arabicBlogId) {
      const payloadAr = {
        data: {
          title: formDataAr.title,
          description_1: convertToBlock(formDataAr.description_1),
          description_2: convertToBlock(formDataAr.description_2),
          description_3: convertToBlock(formDataAr.description_3),
          meta_description: formDataAr.meta_description,
          meta_keywords: formDataAr.meta_keywords,
          alt_text_image: formDataAr.alt_text_image,
          publish: publishData.publish,
          date: publishData.publishDate ? `${publishData.publishDate}T${publishData.publishTime || '00:00'}:00.000Z` : null
        }
      };
      await updateBlog(arabicBlogId, payloadAr, 'ar');
    }

    toast.success("Blog updated successfully!");
    navigate('/bloglist');
    
  } catch (error) {
    console.error("Update error:", error);
    toast.error(`Update failed: ${error.response?.data?.error?.message || error.message}`);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  const currentFormData = language === 'en' ? formData : formDataAr;

  return (
    <div className="bg-white mx-auto p-6 px-12 font-sans">
      {/* Header */}
      <label className="flex justify-between items-start font-headline mb-2">Title</label>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={currentFormData.title}
          onChange={(e) => handleChange(e, language)}
          name="title"
          className="w-3/5 px-4 py-2 text-l font-body font-univers border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mainCharcoal1"
        />
        <div className="flex items-center space-x-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 px-3 py-2 font-headline rounded focus:outline-none"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
     
          <button
            className="export-button"
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
                  value={currentFormData.description_1 || ''}
                  onChange={(e) => handleChange(e, language)}
                  className="w-full font-body font-univers h-32 border border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-mainCharcoal1 mb-4"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  placeholder="Enter your first description here..."
                ></textarea>
                
                {language === 'en' && (
                  <>
                    <h3 className="text-md font-headline mb-2">Image 1</h3>
                    {existingImages.image_1 && (
                      <div className="mb-3">
                        <img 
                          src={existingImages.image_1} 
                          alt={`Existing image 1`} 
                          className="object-cover w-32 h-32 rounded" 
                        />
                      </div>
                    )}
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
                        {existingImages.image_1 ? 'Replace Image 1' : 'Upload Image 1'}
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Description 2 with Image 2 */}
              <div className="bg-white p-5 rounded shadow">
                <h2 className="text-l font-headline mb-2">Section 2</h2>
                <textarea
                  name="description_2"
                  value={currentFormData.description_2 || ''}
                  onChange={(e) => handleChange(e, language)}
                  className="w-full h-32 border font-body font-univers border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-mainCharcoal1 mb-4"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  placeholder="Enter your second description here..."
                ></textarea>
                
                {language === 'en' && (
                  <>
                    <h3 className="text-md font-headline mb-2">Image 2</h3>
                    {existingImages.image_2 && (
                      <div className="mb-3">
                        <img 
                          src={existingImages.image_2} 
                          alt={`Existing image 2`} 
                          className="object-cover w-32 h-32 rounded" 
                        />
                      </div>
                    )}
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
                        {existingImages.image_2 ? 'Replace Image 2' : 'Upload Image 2'}
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Description 3 */}
              <div className="bg-white p-5 rounded shadow">
                <h2 className="text-l font-headline mb-2">Section 3</h2>
                <textarea
                  name="description_3"
                  value={currentFormData.description_3 || ''}
                  onChange={(e) => handleChange(e, language)}
                  className="w-full font-body font-univers h-32 border border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-mainCharcoal1 mb-4"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  placeholder="Enter your third description here..."
                ></textarea>
              </div>

              {/* Featured Image and Alt Text (English only) */}
              {language === 'en' && (
                <div className="bg-white p-5 rounded shadow">
                  <h2 className="text-l font-headline mb-2">Featured Image</h2>
                  {existingImages.featured_image && (
                    <div className="mb-3">
                      <img 
                        src={existingImages.featured_image} 
                        alt="Existing featured image" 
                        className="object-cover w-32 h-32 rounded" 
                      />
                    </div>
                  )}
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
                      {existingImages.featured_image ? 'Replace Featured Image' : 'Upload Featured Image'}
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-headline mb-1">Alt Text for Images</label>
                    <input
                      type="text"
                      placeholder="Enter alt text for all images"
                      name="alt_text_image"
                      value={currentFormData.alt_text_image || ''}
                      onChange={(e) => handleChange(e, language)}
                      className="w-full px-3 py-2 border font-body font-univers border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mainCharcoal1"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'meta' && (
            <div className="bg-white p-5 rounded shadow space-y-4">
              <div>
                <label className="block text-sm font-headline mb-1">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={currentFormData.meta_description || ''}
                  onChange={(e) => handleChange(e, language)}
                  className="w-full px-3 py-2 font-body font-univers border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mainCharcoal1"
                  rows={4}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-headline mb-1">Meta Keywords</label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={currentFormData.meta_keywords || ''}
                  onChange={(e) => handleChange(e, language)}
                  className="w-full px-3 py-2 border font-body font-univers border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mainCharcoal1"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
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
              value={currentFormData.slug || ''}
              readOnly
              className="w-full px-3 py-2 mb-2 border font-body font-universe border-gray-300 rounded"
            />
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
};

export default EditBlog;