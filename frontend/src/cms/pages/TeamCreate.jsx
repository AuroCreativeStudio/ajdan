import React, { useState } from 'react';
import { createTeam } from '../../services/aboutusService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function TeamCreate() {
  const [formEn, setFormEn] = useState({
    member: '',
    role: '',
    image: null,
  });
  const [formAr, setFormAr] = useState({
    member: '',
    role: '',
    image: null,
  });
  const [imagePreviewEn, setImagePreviewEn] = useState(null);
  const [imagePreviewAr, setImagePreviewAr] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('en');
  const navigate = useNavigate();

  // Helper for image upload
  const handleImageChange = async (e, locale) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    if (locale === 'en') setImagePreviewEn(URL.createObjectURL(file));
    else setImagePreviewAr(URL.createObjectURL(file));
    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await axios.post('http://localhost:1337/api/upload', formData);
      if (res.data && res.data[0]) {
        if (locale === 'en') {
          setFormEn((prev) => ({
            ...prev,
            image: res.data[0],
          }));
        } else {
          setFormAr((prev) => ({
            ...prev,
            image: res.data[0],
          }));
        }
        toast.success('Image uploaded!');
      } else {
        toast.error('Image upload failed.');
      }
    } catch (err) {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Handle input change for both forms
  const handleChange = (e, locale) => {
    const { name, value } = e.target;
    if (locale === 'en') {
      setFormEn((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormAr((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit both locales
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare English data
      let imageValueEn = formEn.image;
      if (imageValueEn && typeof imageValueEn === 'object' && imageValueEn.id) {
        imageValueEn = imageValueEn.id;
      }
      const submitFormEn = {
        ...formEn,
        image: imageValueEn,
      };
      // Create English entry first
      const createdEn = await createTeam(submitFormEn, 'en');
      // Prepare Arabic data
      let imageValueAr = formAr.image;
      if (imageValueAr && typeof imageValueAr === 'object' && imageValueAr.id) {
        imageValueAr = imageValueAr.id;
      }
      const submitFormAr = {
        ...formAr,
        image: imageValueAr,
      };
      // Only create Arabic if any field is filled
      if (formAr.member || formAr.role || formAr.image) {
        // 2. Create Arabic, linked to English
        await createTeam(submitFormAr, 'ar', createdEn.data.id); // Pass English ID as relatedId
      }
      toast.success('Team member created successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error('Failed to create team member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg p-6 mx-auto bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold">Create Team Member</h2>
      {/* Tabs */}
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === 'en' && (
          <>
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="member"
                value={formEn.member}
                onChange={(e) => handleChange(e, 'en')}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <input
                type="text"
                name="role"
                value={formEn.role}
                onChange={(e) => handleChange(e, 'en')}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'en')}
                className="w-full px-3 py-2 border rounded"
                disabled={uploading}
              />
              {imagePreviewEn && (
                <img
                  src={imagePreviewEn}
                  alt="Preview"
                  className="object-contain h-24 mt-2 border rounded"
                />
              )}
              {uploading && <div className="text-sm text-gray-500">Uploading...</div>}
            </div>
          </>
        )}
        {tab === 'ar' && (
          <>
            <div>
              <label className="block mb-1 font-medium">Name (Arabic)</label>
              <input
                type="text"
                name="member"
                value={formAr.member}
                onChange={(e) => handleChange(e, 'ar')}
                className="w-full px-3 py-2 border rounded"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Role (Arabic)</label>
              <input
                type="text"
                name="role"
                value={formAr.role}
                onChange={(e) => handleChange(e, 'ar')}
                className="w-full px-3 py-2 border rounded"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Image (Arabic)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'ar')}
                className="w-full px-3 py-2 border rounded"
                disabled={uploading}
              />
              {imagePreviewAr && (
                <img
                  src={imagePreviewAr}
                  alt="Preview"
                  className="object-contain h-24 mt-2 border rounded"
                />
              )}
              {uploading && <div className="text-sm text-gray-500">Uploading...</div>}
            </div>
          </>
        )}
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading || uploading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default TeamCreate;