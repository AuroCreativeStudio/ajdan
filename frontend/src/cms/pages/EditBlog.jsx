import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

const EditBlog = () => {
  const { slug } = useParams();
  const location = useLocation();
  const documentId = location.state?.documentId;
  const locale = 'en';

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const token = 'e2affb9456d4c321d8356000844cb0be5a824262fc1fe123ca291b7d1786a743822da2b1e90f15c449e3cdc05a74f7465aac13206eb18e9866c02b26270fb5175304d283387e459b1fcefd11dcfe79f936deff5285ce3946a77d580b99c29d91f15ebd6e50f9469ecf1e4c541befae8dba145dd58cf5e0795c4599431af4db57'; 
  useEffect(() => {
    const fetchBlog = async () => {
      if (!documentId) {
        console.error("No documentId provided");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:1337/api/blogs-and-news/${documentId}?locale=${locale}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const attributes = res.data?.data?.attributes || {};
        setFormData(attributes);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [documentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? Boolean(checked) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:1337/api/blogs-and-news/${documentId}?locale=${locale}`,
        { data: formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Blog updated successfully!');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Blog</h2>

      {[
        { label: 'Title', name: 'title', type: 'text' },
        { label: 'Description 1', name: 'description_1', type: 'textarea' },
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
        Publish:
        <input
          type="checkbox"
          name="publish"
          checked={!!formData.publish}
          onChange={handleChange}
          className="ml-2"
        />
      </label>

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
