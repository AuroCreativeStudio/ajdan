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
  const locale = 'en';

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
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login on logout
  };
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

  const extractText = (blocks) => {
    return Array.isArray(blocks)
      ? blocks.map(block =>
          Array.isArray(block.children)
            ? block.children.map(child => child.text).join('')
            : ''
        ).join('\n')
      : '';
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
        const blog = await fetchBlogBySlug(slug, locale);
        if (!blog) {
          setLoading(false);
          toast.error('Blog not found!');
          return;
        }

        setBlogId(blog.documentId || null); // <-- Store the blog's ID
        
        setFormData({
          title: blog.title || '',
          description_1: extractText(blog.description_1),
          description_2: extractText(blog.description_2),
          description_3: extractText(blog.description_3),
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
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? Boolean(checked) : value,
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
// In your EditBlog.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
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

    console.log("Payload:", payload); // Debug before sending
    await updateBlog(blogId, payload); // Make sure blogId is correct
    toast.success("Blog updated!");
  } catch (error) {
    toast.error("Update failed: " + error.message);
    console.error("Full error:", error.response?.data);
  }
};

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      
      <Sidebar handleLogout={handleLogout} /> {/* Use the Sidebar component */}
    <form onSubmit={handleSubmit} className="max-w-3xl p-6 mx-auto space-y-4">
      <h2 className="mb-4 text-2xl font-semibold">Edit Blog</h2>

      {/* Text fields */}
      {[{ label: 'Title', name: 'title', type: 'text' },
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
              onChange={handleChange}
              className="w-full p-2 mt-1 border"
              rows={4}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
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
              <img src={existingImages[field]} alt={`Existing ${field}`} className="object-cover w-32 h-32 rounded" />
            </div>
          )}
          <input
            type="file"
            name={field}
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, [field]: e.target.files[0] })}
            className="w-full p-2 border"
          />
        </label>
      ))}

      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Update Blog
      </button>
    </form>
    <ToastContainer />
    </div>
  );
};

export default EditBlog;
