import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBlogBySlug, updateBlog } from '../../services/blogService';
import { logout } from '../../services/authService';
import Sidebar from '../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:1337/';

const EditBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.state?.slug;

  const [locale, setLocale] = useState('en');
  const [blogId, setBlogId] = useState(null); // To track localized ID

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

  const [existingImages, setExistingImages] = useState({});
  const [existingImageIds, setExistingImageIds] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      if (!slug) return;

      try {
        const blog = await fetchBlogBySlug(slug, locale);
        if (!blog) {
          toast.error('Blog not found!');
          setLoading(false);
          return;
        }

        setBlogId(blog.id);

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
            ? (blog.image_1.url.startsWith('http') ? blog.image_1.url : `${API_URL}${blog.image_1.url}`)
            : null,
          image_2: blog.image_2?.url
            ? (blog.image_2.url.startsWith('http') ? blog.image_2.url : `${API_URL}${blog.image_2.url}`)
            : null,
          featured_image: blog.featured_image?.url
            ? (blog.featured_image.url.startsWith('http') ? blog.featured_image.url : `${API_URL}${blog.featured_image.url}`)
            : null,
        });

        setExistingImageIds({
          image_1: blog.image_1?.id || null,
          image_2: blog.image_2?.id || null,
          featured_image: blog.featured_image?.id || null,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Error loading blog');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, locale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('files', file);
    const res = await fetch(`${API_URL}api/upload`, { method: 'POST', body: data });
    const json = await res.json();
    return json[0]?.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploaded = {};

      for (const key of ['image_1', 'image_2', 'featured_image']) {
        if (formData[key]) {
          uploaded[key] = await uploadImage(formData[key]);
        } else {
          uploaded[key] = existingImageIds[key];
        }
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
        alt_text_image: formData.alt_text_image,
        description_1: convertToBlock(formData.description_1),
        description_2: convertToBlock(formData.description_2),
        description_3: convertToBlock(formData.description_3),
        image_1: uploaded.image_1,
        image_2: uploaded.image_2,
        featured_image: uploaded.featured_image,
        locale,
      };

      await updateBlog(slug, payload, blogId);
      toast.success('Blog updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update blog.');
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />

      <div className="w-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Edit Blog</h2>
          <div>
            <button
              className={`px-3 py-1 mr-2 rounded ${locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setLocale('en')}
            >
              English
            </button>
            <button
              className={`px-3 py-1 rounded ${locale === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setLocale('ar')}
            >
              Arabic
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4 bg-white p-6 rounded shadow">
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

          <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            Update Blog ({locale.toUpperCase()})
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default EditBlog;
