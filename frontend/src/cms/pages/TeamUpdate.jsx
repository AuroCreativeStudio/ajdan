import React, { useState } from 'react';
import { updateTeam } from '../../services/aboutusService';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function TeamUpdate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { member } = location.state || {};

  // Helper to extract image URL from Strapi formats or fallback
  const getImageUrl = (img) => {
    if (!img) return "https://docs.material-tailwind.com/img/team-3.jpg";
    if (img.url) {
      return img.url.startsWith('http') ? img.url : `http://localhost:1337${img.url}`;
    }
    if (typeof img === 'string') {
      return img;
    }
    return "https://docs.material-tailwind.com/img/team-3.jpg";
  };

  const [form, setForm] = useState({
    member: member?.member || member?.name || '',
    role: member?.role || '',
    image: member?.image || null,
  });
  const [imagePreview, setImagePreview] = useState(() => getImageUrl(member?.image));
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

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
        setImagePreview(getImageUrl(res.data[0]));
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
      // Always send the current image (existing or newly uploaded)
      let imageValue = form.image;
      // If image is an object with id, send id; if string, send as is
      if (imageValue && typeof imageValue === 'object' && imageValue.id) {
        imageValue = imageValue.id;
      }
      const submitForm = {
        ...form,
        image: imageValue,
      };
      await updateTeam(member.documentId, submitForm);
      toast.success('Team member updated successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error('Failed to update team member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Team Member</h2>
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
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default TeamUpdate;