import React, { useState } from 'react';
import { updateTeam } from '../../services/aboutusService';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TeamUpdate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { member } = location.state || {};

  // Initialize form with member data or empty values
  const [form, setForm] = useState({
    member: member?.member || member?.name || '',
    role: member?.role || '',
    // image: member?.image || '',
    // facebook: member?.facebook || '',
    // twitter: member?.twitter || '',
    // instagram: member?.instagram || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTeam(member.documentId, form); // Pass documentId instead of id
      toast.success('Team member updated successfully!');
      setTimeout(() => navigate(-1), 1500); // Wait for toast before navigating
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
        {/* <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div> */}
        {/* <div>
          <label className="block font-medium mb-1">Facebook</label>
          <input
            type="text"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Twitter</label>
          <input
            type="text"
            name="twitter"
            value={form.twitter}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Instagram</label>
          <input
            type="text"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div> */}
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default TeamUpdate;