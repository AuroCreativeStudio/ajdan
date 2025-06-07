import React, { useState, useEffect } from 'react';
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

  // Find Arabic localization if exists
  const arabicMember = member?.localizations?.find(loc => loc.locale === 'ar');

  // Form state for both locales
  const [formEn, setFormEn] = useState({
    member: member?.member || member?.name || '',
    role: member?.role || '',
    image: member?.image || null,
  });
  const [formAr, setFormAr] = useState({
    member: arabicMember?.member || arabicMember?.name || '',
    role: arabicMember?.role || '',
    image: arabicMember?.image || null,
  });

  // Image previews for both locales
  const [imagePreviewEn, setImagePreviewEn] = useState(() => getImageUrl(member?.image));
  const [imagePreviewAr, setImagePreviewAr] = useState(() => getImageUrl(arabicMember?.image));
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Tab state
  const [tab, setTab] = useState('en');


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

  // Handle image upload for both forms
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
          setImagePreviewEn(getImageUrl(res.data[0]));
        } else {
          setFormAr((prev) => ({
            ...prev,
            image: res.data[0],
          }));
          setImagePreviewAr(getImageUrl(res.data[0]));
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
      // Prepare Arabic data
      let imageValueAr = formAr.image;
      if (imageValueAr && typeof imageValueAr === 'object' && imageValueAr.id) {
        imageValueAr = imageValueAr.id;
      }
      const submitFormAr = {
        ...formAr,
        image: imageValueAr,
      };
      // Update English (pass locale as query param)
      await updateTeam(member.documentId, submitFormEn, 'en');
      // Update Arabic if exists, else create
      if (arabicMember) {
        await updateTeam(arabicMember.documentId, submitFormAr, 'ar');
      } else if (formAr.member || formAr.role || formAr.image) {
        // Optionally: create Arabic entry if any field is filled
        // await createTeam({ ...submitFormAr, localizations: [member.documentId] }, 'ar');
      }
      toast.success('Team member updated successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error('Failed to update team member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-2xl p-6 mx-auto bg-white rounded shadow">
          <h2 className="mb-4 text-2xl font-bold">Update Team Member</h2>
          
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
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default TeamUpdate;