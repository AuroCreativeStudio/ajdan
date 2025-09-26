import React, { useState, useEffect, useContext } from 'react';
import { getSocialLinks, updateSocialLink } from '../../services/socialiconService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CmsLangContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = `${import.meta.env.VITE_API_URL}/api/social-links`; // Define the API URL

function Socialmedia() {
  const navigate = useNavigate();
  const { cmsLang } = useContext(CmsLangContext);
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    twitter: '',
    linkedin: '',
    tiktok: '',
    whatsapp: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

const fetchSocialLinks = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API_URL}?locale=en`); // Use the defined API_URL
    const first = res.data?.data?.[0];
    if (first) {
      setSocialLinks({
        instagram: first.instagram || '',
        twitter: first.twitter || '',
        linkedin: first.linkedin || '',
        tiktok: first.tiktok || '',
        whatsapp: first.whatsapp || '',
        documentId: first.documentId, // <-- important
      });
    } else {
      setSocialLinks({ documentId: null });
    }
  } catch (err) {
    console.error(err);
    toast.error('Failed to fetch social links');
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

// Save or create social links
const handleSave = async () => {
  if (!socialLinks.documentId) {
    toast.error("Social links entry not found.");
    return;
  }

  const payload = {
    instagram: socialLinks.instagram,
    twitter: socialLinks.twitter,
    linkedin: socialLinks.linkedin,
    tiktok: socialLinks.tiktok,
    whatsapp: socialLinks.whatsapp,
  };

  try {
    await axios.put(`${API_URL}/${socialLinks.documentId}`, { data: payload });
    toast.success("Social links updated successfully!");
  } catch (err) {
    console.error(err.response?.data || err);
    toast.error("Failed to update social links");
  }
};





  if (loading) {
    return (
      <section
        className="bg-white ml-64 dark:bg-gray-900"
        dir={cmsLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="py-8 px-4 mx-auto max-w-4xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold">Social Media Links</h2>
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-white ml-64 dark:bg-gray-900"
      dir={cmsLang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="py-8 px-4 mx-auto max-w-4xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold">Social Media Links</h2>

        <div className="grid gap-4 sm:grid-cols-1 sm:gap-6">
          {['instagram', 'twitter', 'linkedin', 'tiktok', 'whatsapp'].map(
            (platform) => (
              <div
                key={platform}
                className="flex flex-col p-4 border rounded-lg"
              >
                <label className="block text-sm font-medium mb-1 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  name={platform}
                  value={socialLinks[platform]}
                  onChange={handleChange}
                  placeholder={`Enter ${platform} URL`}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            )
          )}
        </div>

        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Save All Links
        </button>

        <ToastContainer position="top-right" />
      </div>
    </section>
  );
}

export default Socialmedia;
