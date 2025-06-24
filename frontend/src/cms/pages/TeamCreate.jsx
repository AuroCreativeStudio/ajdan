import React, { useState, useEffect } from 'react';
import { createTeam } from '../../services/aboutusService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function TeamCreate() {
  const [formData, setFormData] = useState({
    member: '',
    role_en: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clean up image preview
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await axios.post('http://localhost:1337/api/upload', formData);
      
      if (res.data && res.data[0]) {
        setFormData(prev => ({
          ...prev,
          image: res.data[0],
        }));
        toast.success('Image uploaded successfully!');
      }
    } catch (err) {
      toast.error('Failed to upload image');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.member || !formData.role_en) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    
    try {
      await createTeam({
        member: formData.member,
        role_en: formData.role_en,
        image: formData.image?.id
      });

      toast.success('Team member created successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error('Creation error:', {
        error: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      toast.error(error.response?.data?.error?.message || 'Failed to create team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white mx-auto dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add a new team member
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="member" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Name *
              </label>
              <input
                type="text"
                name="member"
                id="member"
                value={formData.member}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type member name"
                required
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Role *
              </label>
              <select
                name="role_en"
                id="role"
                value={formData.role_en}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              >
                <option value="">Select a role</option>
                <option value="Board of Directors">Board of Directors</option>
                <option value="Team">Team</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                disabled={uploading}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-48 mt-2 rounded border"
                />
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || uploading}
            className="mt-6 export-button"
          >
            {loading ? 'Creating...' : 'Add team member'}
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </section>
  );
}

export default TeamCreate;