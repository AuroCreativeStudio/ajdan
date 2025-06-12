import React, { useState, useEffect } from 'react';
import { createTeam } from '../../services/aboutusService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function TeamCreate() {
  // For localized fields (managed by Strapi)
  const [localizedForm, setLocalizedForm] = useState({
    member: '',
    image: null
  });
  
  // For custom role fields
  const [customRoles, setCustomRoles] = useState({
    role_en: '',
    role_ar: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('en');
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
    
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await axios.post('http://localhost:1337/api/upload', formData);
      
      if (res.data && res.data[0]) {
        setLocalizedForm(prev => ({
          ...prev,
          image: res.data[0],
        }));
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload image');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleLocalizedChange = (e) => {
    const { name, value } = e.target;
    setLocalizedForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e, locale) => {
    const { value } = e.target;
    setCustomRoles(prev => ({
      ...prev,
      [`role_${locale}`]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate English form (required fields)
    if (!localizedForm.member || !customRoles.role_en) {
      toast.error('Please fill all required fields in English');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare data for both languages
      const submitData = {
        // Localized fields (managed by Strapi)
        member: localizedForm.member,
        image: localizedForm.image?.id || null,
        
        // Custom role fields
        role_en: customRoles.role_en,
        role_ar: customRoles.role_ar || customRoles.role_en // Fallback to English if empty
      };

      // Create the team member
      await createTeam(submitData);

      toast.success('Team member created successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 
                         error.message || 
                         'Failed to create team member';
      toast.error(errorMessage);
      console.error('Creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
     <section className="bg-white ml-64 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold font-headline text-ma dark:text-white">
          {tab === 'en' ? 'Add a new team member' : 'إضافة عضو جديد إلى الفريق'}
        </h2>
        
        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-300">
          <button
            type="button"
            className={`px-4 py-2 rounded-t-lg border-b-2 font-medium transition duration-150 ease-in-out 
              ${tab === 'en' 
                ? 'text-primary-700 border-b-mainCharcoal1 bg-white' 
                : 'text-gray-700 border-b-transparent'}`}
            onClick={() => setTab('en')}
          >
            English
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-t-lg border-b-2 font-univers transition duration-150 ease-in-out 
              ${tab === 'ar' 
                ? 'text-primary-700 border-b-mainCharcoal bg-white' 
                : 'text-gray-700 border-b-transparent'}`}
            onClick={() => setTab('ar')}
          >
            العربية
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {tab === 'en' && (
              <>
                <div className="sm:col-span-2">
                  <label htmlFor="member" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="member"
                    id="member"
                    value={localizedForm.member}
                    onChange={handleLocalizedChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type member name"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="role-en" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Role *
                  </label>
                  <select
                    id="role-en"
                    value={customRoles.role_en}
                    onChange={(e) => handleRoleChange(e, 'en')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="Board of Director">Board of Directors</option>
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
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full h-48 rounded border"
                      />
                    </div>
                  )}
                  {uploading && <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Uploading image...</p>}
                </div>
              </>
            )}
            
            {tab === 'ar' && (
              <>
                <div className="sm:col-span-2">
                  <label htmlFor="member-ar" className="block mb-2 text-sm font-univers text-gray-900 dark:text-white">
                    الاسم
                  </label>
                  <input
                    type="text"
                    name="member"
                    id="member-ar"
                    value={localizedForm.member}
                    onChange={handleLocalizedChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 font-univers text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="اكتب اسم العضو"
                    dir="rtl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="role-ar" className="block mb-2 text-sm font-univers text-gray-900 dark:text-white">
                    دور
                  </label>
                  <select
                    id="role-ar"
                    value={customRoles.role_ar}
                    onChange={(e) => handleRoleChange(e, 'ar')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 font-univers text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    dir="rtl"
                  >
                    <option value="">اختر الدور</option>
                    <option value="مجلس الإدارة">مجلس الإدارة</option>
                    <option value="فريق">فريق</option>
                  </select>
                </div>
              </>
            )}
          </div>
         <button
            type="submit"
            disabled={loading || uploading}
            className="export-button mt-12"
          >
            {loading 
              ? (tab === 'en' ? 'Creating...' : 'جارٍ الإنشاء...') 
              : (tab === 'en' ? 'Add team member' : 'إضافة عضو جديد إلى الفريق')}
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </section>
  );
}

export default TeamCreate;