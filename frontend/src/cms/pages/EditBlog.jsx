import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchBlogByDocumentId, updateBlog } from '../../services/blogService';

const EditBlog = () => {
  const location = useLocation();
  const documentId = location.state?.documentId;
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
  });

  const [loading, setLoading] = useState(true);

  // Utility to extract plain text from block structure
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
      if (!documentId) {
        console.error("No documentId provided");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchBlogByDocumentId(documentId, locale);
        const blog = data?.data || {};

        setFormData({
          title: blog.title || '',
          description_1: extractText(blog.description_1),
          description_2: extractText(blog.description_2),
          description_3: extractText(blog.description_3),
          meta_description: blog.meta_description || '',
          meta_keywords: blog.meta_keywords || '',
          alt_text_image: blog.alt_text_image || '',
          slug: blog.slug || '',
        });
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [documentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? Boolean(checked) : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    title: formData.title,
    slug: formData.slug,
    meta_description: formData.meta_description,
    meta_keywords: formData.meta_keywords,
    // alt_text_image: formData.alt_text_image,
    description_1: convertToBlock(formData.description_1),
    description_2: convertToBlock(formData.description_2 || ''),
    description_3: convertToBlock(formData.description_3 || ''),
  };

  try {
    console.log('Payload being submitted:', { data: payload });
    await updateBlog(documentId, payload);
    alert('Blog updated successfully!');
  } catch (error) {
    console.error('Error updating blog:', error.response?.data || error.message);
    alert('Failed to update blog.');
  }
};



  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Blog</h2>

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
              className="w-full border p-2 mt-1"
              rows={4}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className="w-full border p-2 mt-1"
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
          className="w-full border p-2 mt-1 bg-gray-100"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update Blog
      </button>
    </form>
  );
};

export default EditBlog;
