import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchBlogBySlug, updateBlog } from '../../services/blogService';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:1337/';

const EditBlog = () => {
  const location = useLocation();
  const slug = location.state?.slug;
  const [tab, setTab] = useState('en');
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
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

        setBlogId(blog.documentId || null);
        
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
            setArabicBlogId(arabicBlog.documentId || null);
            
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
      // Upload images and prepare payload for English
      const uploadedImages = {
        image_1: formData.image_1 ? await uploadImage(formData.image_1) : existingImageIds.image_1,
        image_2: formData.image_2 ? await uploadImage(formData.image_2) : existingImageIds.image_2,
        featured_image: formData.featured_image ? await uploadImage(formData.featured_image) : existingImageIds.featured_image
      };

      const payload = {
        data: {  
          title: formData.title,
          slug: formData.slug,
          description_1: formData.description_1,
          description_2: formData.description_2 || null,
          description_3: formData.description_3 || null, 
          meta_description: formData.meta_description || "", 
          meta_keywords: formData.meta_keywords || "",
          image_1: uploadedImages.image_1 || null, 
          image_2: uploadedImages.image_2 || null,
          featured_image: uploadedImages.featured_image || null,
          alt_text_image: formData.alt_text_image || "",
        }
      };

      // Update English blog
      await updateBlog(blogId, payload);
      
      // Update Arabic blog if exists
      if (arabicBlogId) {
        const payloadAr = {
          data: {
            title: formDataAr.title,
            description_1: formDataAr.description_1,
            description_2: formDataAr.description_2 || null,
            description_3: formDataAr.description_3 || null,
            meta_description: formDataAr.meta_description || "",
            meta_keywords: formDataAr.meta_keywords || "",
            alt_text_image: formDataAr.alt_text_image || "",
          }
         
        };
         console.log('Arabic Payload:', payloadAr); 
        await updateBlog(arabicBlogId, payloadAr, 'ar');
      }
     
      toast.success("Blog updated successfully!");
    } catch (error) {
      toast.error("Update failed: " + error.message);
      console.error("Full error:", error.response?.data);
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="mb-4 text-2xl font-semibold">Edit Blog</h2>
        
        <div className="flex mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-t ${tab === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('en')}
          >
            English
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-t ${tab === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('ar')}
          >
            Arabic
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
          {tab === 'en' && (
            <>
              {/* English form fields */}
              {[
                { label: 'Title', name: 'title', type: 'text' },
                { label: 'Description 1', name: 'description_1', type: 'textarea' },
                { label: 'Description 2', name: 'description_2', type: 'textarea' },
                { label: 'Description 3', name: 'description_3', type: 'textarea' },
                { label: 'Meta Description', name: 'meta_description', type: 'text' },
                { label: 'Meta Keywords', name: 'meta_keywords', type: 'text' },
                { label: 'Alt Text (Image)', name: 'alt_text_image', type: 'text' },
              ].map(({ label, name, type }) => (
                <label className="block" key={name}>
                  {label}:
                  {type === 'textarea' ? (
                    <textarea
                      name={name}
                      value={formData[name] || ''}
                      onChange={(e) => handleChange(e, 'en')}
                      className="w-full p-2 mt-1 border"
                      rows={4}
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name] || ''}
                      onChange={(e) => handleChange(e, 'en')}
                      className="w-full p-2 mt-1 border"
                    />
                  )}
                </label>
              ))}

              <label className="block">
                Slug:
                <input
                  type="text"
                  name="slug"
                  value={formData.slug || ''}
                  readOnly
                  className="w-full p-2 mt-1 bg-gray-100 border"
                />
              </label>

              {/* Image fields */}
              {['image_1', 'image_2', 'featured_image'].map((field) => (
                <label key={field} className="block">
                  {field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:
                  {existingImages[field] && (
                    <div className="mb-2">
                      <img 
                        src={existingImages[field]} 
                        alt={`Existing ${field}`} 
                        className="object-cover w-32 h-32 rounded" 
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name={field}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, field)}
                    className="w-full p-2 border"
                  />
                </label>
              ))}
            </>
          )}

          {tab === 'ar' && (
            <>
              {/* Arabic form fields */}
              {[
                { label: 'العنوان', name: 'title', type: 'text' },
                { label: 'الوصف 1', name: 'description_1', type: 'textarea' },
                { label: 'الوصف 2', name: 'description_2', type: 'textarea' },
                { label: 'الوصف 3', name: 'description_3', type: 'textarea' },
                { label: 'وصف التعريف', name: 'meta_description', type: 'text' },
                { label: 'كلمات البحث', name: 'meta_keywords', type: 'text' },
                { label: 'النص البديل (الصورة)', name: 'alt_text_image', type: 'text' },
              ].map(({ label, name, type }) => (
                <label className="block" key={name}>
                  {label}:
                  {type === 'textarea' ? (
                    <textarea
                      name={name}
                      value={formDataAr[name] || ''}
                      onChange={(e) => handleChange(e, 'ar')}
                      className="w-full p-2 mt-1 border"
                      rows={4}
                      dir="rtl"
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formDataAr[name] || ''}
                      onChange={(e) => handleChange(e, 'ar')}
                      className="w-full p-2 mt-1 border"
                      dir="rtl"
                    />
                  )}
                </label>
              ))}

              <label className="block">
                الرابط:
                <input
                  type="text"
                  name="slug"
                  value={formDataAr.slug || ''}
                  readOnly
                  className="w-full p-2 mt-1 bg-gray-100 border"
                  dir="rtl"
                />
              </label>
            </>
          )}

          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Update Blog
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditBlog;