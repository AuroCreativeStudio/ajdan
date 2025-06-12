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

  // Find Arabic localization if exists
  const arabicMember = member?.localizations?.find(loc => loc.locale === 'ar');

  // Form state for both locales
  const [formEn, setFormEn] = useState({
    member: member?.member || member?.name || '',
    role: member?.role_en || member?.role || '',
    image: member?.image || null,
  });

  const [formAr, setFormAr] = useState({
    member: arabicMember?.member || arabicMember?.name || '',
    role: arabicMember?.role_ar || arabicMember?.role || '',
    image: arabicMember?.image || null,
  });

  // Image previews for both locales
  const [imagePreviewEn, setImagePreviewEn] = useState(() => getImageUrl(member?.image));
  const [imagePreviewAr, setImagePreviewAr] = useState(() => getImageUrl(arabicMember?.image));
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Role options - updated to match your dropdown pattern
  const roleOptions = {
    en: [
      { value: 'Board of Director', label: 'Board of Directors' },
      { value: 'Team', label: 'Team' }
    ],
    ar: [
      { value: 'مجلس الإدارة', label: 'مجلس الإدارة' },
      { value: 'فريق', label: 'فريق' }
    ]
  };

  // Handle input change for both forms
  const handleChange = (e, locale) => {
    const { name, value } = e.target;
    if (locale === 'en') {
      setFormEn(prev => ({ ...prev, [name]: value }));
    } else {
      setFormAr(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle role selection from dropdown
  const handleRoleSelect = (value, locale) => {
    if (locale === 'en') {
      setFormEn(prev => ({ ...prev, role: value }));
    } else {
      setFormAr(prev => ({ ...prev, role: value }));
    }
    setDropdownOpen(false);
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
        const uploadedImage = { id: res.data[0].id, ...res.data[0] };
        if (locale === 'en') {
          setFormEn(prev => ({ ...prev, image: uploadedImage }));
        } else {
          setFormAr(prev => ({ ...prev, image: uploadedImage }));
        }
        toast.success('Image uploaded!');
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
    // Prepare data in the exact format your API expects
    const payloadEn = {
      member: formEn.member,
      role_en: formEn.role,  // Note: role_en instead of role
      locale: 'en'
    };

    const payloadAr = {
      member: formAr.member,
      role_ar: formAr.role,  // Note: role_ar instead of role
      locale: 'ar'
    };

    // Update English version
    await updateTeam(member.documentId, payloadEn, 'en');
    
    // Update Arabic version if exists
    if (arabicMember?.documentId) {
      await updateTeam(arabicMember.documentId, payloadAr, 'ar');
    } else if (formAr.member || formAr.role) {
      // Create Arabic version if it doesn't exist
      await createTeam({
        ...payloadAr,
        localizations: [member.documentId]
      });
    }
    
    toast.success('Team member updated successfully!');
    setTimeout(() => navigate(-1), 1500);
  } catch (error) {
    console.error('Full error:', {
      status: error.response?.status,
      message: error.response?.data?.error?.message,
      details: error.response?.data
    });
    
    toast.error(
      error.response?.data?.error?.message || 
      'Failed to update team member. Please check console for details.'
    );
  } finally {
    setLoading(false);
  }
};
  // Render role dropdown similar to your ProjectUpdate component
  const renderRoleDropdown = (locale) => {
    const currentRole = locale === 'en' ? formEn.role : formAr.role;
    const options = locale === 'en' ? roleOptions.en : roleOptions.ar;
    
    return (
      <div className="sm:col-span-2 relative">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {locale === 'en' ? 'Role' : 'الدور'}
        </label>
        <div 
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-pointer flex justify-between items-center ${
            locale === 'ar' ? 'text-right' : ''
          }`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>
            {currentRole || (locale === 'en' ? 'Select role...' : 'اختر الدور...')}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {dropdownOpen && (
          <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ${
            locale === 'ar' ? 'text-right' : ''
          }`}>
            <div className="p-2">
              {options.map((option) => (
                <div 
                  key={option.value} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRoleSelect(option.value, locale)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!member) return <div className="mt-20 text-center text-gray-600">No team member data provided.</div>;

  return (
    <section className="bg-white ml-64 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold font-headline text-gray-900 dark:text-white">
          {tab === 'en' ? 'Update team member' : 'تحديث عضو الفريق'}
        </h2>
        
        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-300">
          <button
            type="button"
            className={`px-4 py-2 rounded-t-lg border-b-2 font-medium transition duration-150 ease-in-out 
              ${tab === 'en' 
                ? 'text-primary-700 border-b-black bg-white' 
                : 'text-gray-700 border-b-transparent'}`}
            onClick={() => {
              setTab('en');
              setDropdownOpen(false);
            }}
          >
            English
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-t-lg border-b-2 font-univers transition duration-150 ease-in-out 
              ${tab === 'ar' 
                ? 'text-primary-700 border-b-black bg-white' 
                : 'text-gray-700 border-b-transparent'}`}
            onClick={() => {
              setTab('ar');
              setDropdownOpen(false);
            }}
          >
            العربية
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor={`member-${tab}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {tab === 'en' ? 'Name' : 'الاسم'}
              </label>
              <input
                type="text"
                name="member"
                id={`member-${tab}`}
                value={tab === 'en' ? formEn.member : formAr.member}
                onChange={(e) => handleChange(e, tab)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={tab === 'en' ? 'Type member name' : 'اكتب اسم العضو'}
                required
                dir={tab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Role dropdown */}
            {renderRoleDropdown(tab)}

            <div className="sm:col-span-2">
              <label htmlFor={`image-${tab}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {tab === 'en' ? 'Image' : 'الصورة'}
              </label>
              <input
                type="file"
                id={`image-${tab}`}
                accept="image/*"
                onChange={(e) => handleImageChange(e, tab)}
                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                disabled={uploading}
              />
              {(tab === 'en' ? imagePreviewEn : imagePreviewAr) && (
                <img
                  src={tab === 'en' ? imagePreviewEn : imagePreviewAr}
                  alt="Preview"
                  className="object-contain h-24 mt-2 border rounded"
                />
              )}
              {uploading && (
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {tab === 'en' ? 'Uploading image...' : 'جارٍ رفع الصورة...'}
                </div>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || uploading}
            className="export-button mt-6 font-univers"
          >
            {loading 
              ? (tab === 'en' ? 'Updating...' : 'جارٍ التحديث...') 
              : (tab === 'en' ? 'Update team member' : 'تحديث عضو الفريق')}
          </button>
        </form>
        <ToastContainer />
      </div>
    </section>
  );
}

export default TeamUpdate;