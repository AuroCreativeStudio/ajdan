import React, { useState } from 'react';
import { createTeam } from '../../services/aboutusService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function TeamCreate() {
  const [form, setForm] = useState({
    member: '',
    role: '',
    image: null, // Store uploaded image file info
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setImagePreview(URL.createObjectURL(file));
    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await axios.post('http://localhost:1337/api/upload', formData);
      if (res.data && res.data[0]) {
        setForm((prev) => ({
          ...prev,
          image: res.data[0],
        }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitForm = {
        ...form,
        image: form.image?.id || null,
      };
      await createTeam(submitForm);
      toast.success('Team member created successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error('Failed to create team member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Team Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="member"
            value={form.member}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Role</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded px-3 py-2"
            disabled={uploading}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-24 object-contain border rounded"
            />
          )}
          {uploading && <div className="text-sm text-gray-500">Uploading...</div>}
        </div>
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