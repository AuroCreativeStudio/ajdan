import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProjectList } from '../../services/listService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import image from '../../assets/image/one.jpg';

function ProjectUpdate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const project = state?.project;
  const arabicProject = project?.localizations?.find(loc => loc.locale === 'ar');

  // State definitions
  const [tab, setTab] = useState('en');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    amenities: false,
    property_type: false,
    payment_plan: false
  });

  // Default values for English fields
  const defaultAmenitiesEn = ['Swimming Pool', 'Gym', 'Sea View', 'Smart Home'];
  const defaultPropertyTypesEn = ['Residential', 'Commercial', 'Mixed-Use'];
  const defaultPaymentPlansEn = ['Financing', 'Down Payment'];

  // Default values for Arabic fields
  const defaultAmenitiesAr = ['إطلالة على البحر', 'المنزل الذكي', 'نادي رياضي','حمام السباحة'];
  const defaultPropertyTypesAr = ['سكني','تجاري','متعدد الاستخدامات'];
  const defaultPaymentPlansAr = ['التمويل', 'دفعة مبدئية'];

const getImageUrl = (img) => {
  if (!img) return image;

  // If it's an array, pick the first image object
  if (Array.isArray(img) && img.length > 0) {
    img = img[0];
  }

  if (img.url) {
    return img.url.startsWith('http')
      ? img.url
      : `${import.meta.env.VITE_API_URL
 || 'http://localhost:1337'}${img.url}`;
  }

  if (typeof img === 'string') {
    return img;
  }

  return image; // Default image fallback
};

  const [form, setForm] = useState({
    title: project?.title || '',
    place: project?.place || '',
    building: project?.building || '',
    squarefeet: project?.square_feet || '',
    description: project?.description || '',
    amenities_en: project?.amenities_en || defaultAmenitiesEn,
    property_type_en: project?.property_type_en || defaultPropertyTypesEn,
    payment_plan_en: project?.payment_plan_en || defaultPaymentPlansEn,
    feature_image: project?.feature_image || null
  });

  const [formAr, setFormAr] = useState({
    title: project?.title_ar || arabicProject?.title || '',
    place: arabicProject?.place || '',
    building: arabicProject?.building || '',
    squarefeet: arabicProject?.square_feet || '',
    description: arabicProject?.description || '',
    amenities_ar: arabicProject?.amenities_ar || defaultAmenitiesAr,
    property_type_ar: arabicProject?.property_type_ar || defaultPropertyTypesAr,
    payment_plan_ar: arabicProject?.payment_plan_ar || defaultPaymentPlansAr,
    feature_image: arabicProject?.feature_image || null
  });

  const [imagePreviewEn, setImagePreviewEn] = useState(() => getImageUrl(project?.feature_image));
  const [imagePreviewAr, setImagePreviewAr] = useState(() => getImageUrl(arabicProject?.feature_image));

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || '',
        place: project.place || '',
        building: project.building || '',
        squarefeet: project.square_feet || '',
        description: project.description || '',
        amenities_en: project.amenities_en || defaultAmenitiesEn,
        property_type_en: project.property_type_en || defaultPropertyTypesEn,
        payment_plan_en: project.payment_plan_en || defaultPaymentPlansEn,
        feature_image: project.feature_image || null,
      });

      setFormAr(prev => ({
        ...prev,
        title: project.title_ar || arabicProject?.title || '',
        place: arabicProject?.place || prev.place,
        building: arabicProject?.building || prev.building,
        squarefeet: arabicProject?.square_feet || prev.squarefeet,
        description: arabicProject?.description || prev.description,
        amenities_ar: arabicProject?.amenities_ar || defaultAmenitiesAr,
        property_type_ar: arabicProject?.property_type_ar || defaultPropertyTypesAr,
        payment_plan_ar: arabicProject?.payment_plan_ar || defaultPaymentPlansAr,
        feature_image: arabicProject?.feature_image || null,
      }));

      setImagePreviewEn(getImageUrl(project.feature_image));
      setImagePreviewAr(getImageUrl(arabicProject?.feature_image));
    }
  }, [project, arabicProject]);

  const toggleDropdown = (field) => {
    setDropdownOpen(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (e, locale = 'en') => {
    const { name, value } = e.target;
    if (locale === 'en') {
      setForm(prev => ({ ...prev, [name]: value }));
    } else {
      setFormAr(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (field, value, locale = 'en') => {
    if (locale === 'en') {
      setForm(prev => {
        const currentValues = prev[field] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value];
        return { ...prev, [field]: newValues };
      });
    } else {
      setFormAr(prev => {
        const currentValues = prev[field] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value];
        return { ...prev, [field]: newValues };
      });
    }
  };

const handleImageChange = async (e, locale) => {
  const file = e.target.files[0];
  if (!file) return;
  
  setUploading(true);
  const previewUrl = URL.createObjectURL(file);
  
  if (locale === 'en') {
    setImagePreviewEn(previewUrl);
  } else {
    setImagePreviewAr(previewUrl);
  }

  try {
    const formData = new FormData();
    formData.append('files', file);
    
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/upload`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    
    if (res.data && res.data[0]) {
      const uploadedImage = { id: res.data[0].id, ...res.data[0] };
      
      if (locale === 'en') {
        setForm(prev => ({ ...prev, feature_image: uploadedImage }));
      } else {
        setFormAr(prev => ({ ...prev, feature_image: uploadedImage }));
      }
      
      toast.success(tab === 'en' ? 'Image uploaded successfully!' : 'تم تحميل الصورة بنجاح!');
    }
  } catch (err) {
    console.error('Image upload error:', err);
    toast.error(tab === 'en' ? 'Failed to upload image' : 'فشل تحميل الصورة');
    
    if (locale === 'en') {
      setImagePreviewEn(getImageUrl(form.feature_image));
    } else {
      setImagePreviewAr(getImageUrl(formAr.feature_image));
    }
  } finally {
    setUploading(false);
    URL.revokeObjectURL(previewUrl); // Clean up memory
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (!project?.documentId) {
      throw new Error('No document ID available');
    }

    // Prepare update data
    const updateData = {
      place: form.place,
      building: form.building,
      square_feet: Number(form.squarefeet),
      description: form.description,
      amenities_en: form.amenities_en,
      property_type_en: form.property_type_en,
      payment_plan_en: form.payment_plan_en,
      feature_image: form.feature_image?.id ? [form.feature_image.id] : null
    };

    // Execute update
    const updatedProject = await updateProjectList(
      project.documentId, // Using documentId instead of id
      updateData,
      'en'
    );

    toast.success('Project updated successfully!');
    setTimeout(() => navigate(-1), 1500);
  } catch (error) {
    let errorMessage = 'Failed to update project';
    
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = `
          API endpoint not found. Verify:
          1. Content-type exists in Strapi (should be "list")
          2. Document ID ${project?.documentId} exists
          3. You have update permissions
        `;
      } else {
        errorMessage = error.response.data?.error?.message || error.message;
      }
    }
    
    toast.error(errorMessage);
    console.error('Update error details:', error);
  } finally {
    setLoading(false);
  }
};

  if (!project) return <div className="mt-20 text-center text-gray-600">No project data provided.</div>;

  const getFieldValue = (field, locale) => {
    if (locale === 'en') return form[field];
    return formAr[field];
  };

  const renderDropdownCheckbox = (field, label, locale = 'en') => {
    const fieldName = `${field}_${locale}`;
    const currentValues = locale === 'en' ? form[fieldName] : formAr[fieldName];
    
    let options = [];
    if (field.includes('amenities')) {
      options = locale === 'en' ? defaultAmenitiesEn : defaultAmenitiesAr;
    } else if (field.includes('property_type')) {
      options = locale === 'en' ? defaultPropertyTypesEn : defaultPropertyTypesAr;
    } else if (field.includes('payment_plan')) {
      options = locale === 'en' ? defaultPaymentPlansEn : defaultPaymentPlansAr;
    }
    
    return (
      <div className="sm:col-span-2 relative">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        <div 
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-pointer flex justify-between items-center ${
            locale === 'ar' ? 'text-right' : ''
          }`}
          onClick={() => toggleDropdown(field)}
        >
          <span>
            {currentValues.length > 0 
              ? currentValues.join(', ') 
              : `Select ${label.toLowerCase()}...`}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${dropdownOpen[field] ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {dropdownOpen[field] && (
          <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ${
            locale === 'ar' ? 'text-right' : ''
          }`}>
            <div className="p-2">
              {options.map((option) => (
                <div key={option} className="flex items-center p-2 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    id={`${fieldName}-${option}`}
                    checked={currentValues.includes(option)}
                    onChange={() => handleCheckboxChange(fieldName, option, locale)}
                    className={locale === 'ar' ? 'ml-2' : 'mr-2'}
                  />
                  <label htmlFor={`${fieldName}-${option}`} className="cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="bg-white ml-64 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-4xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold font-headline text-gray-900 dark:text-white">Update Project</h2>
        
        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-300">
          <button
            type="button"
            className={`px-4 py-2 rounded-t-lg border-b-2 font-medium transition duration-150 ease-in-out 
              ${tab === 'en' 
                ? 'text-primary-700 border-b-black bg-white' 
                : 'text-gray-700 border-b-transparent'}`}
            onClick={() => setTab('en')}
          >
            English
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-t-lg border-b-2 font-univers transition duration-150 ease-in-out 
              ${tab === 'ar' 
                ? 'text-primary-700 border-b-black bg-white' 
                : 'text-gray-700 border-b-transparent'}`}
            onClick={() => setTab('ar')}
          >
            العربية
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Title and Place */}
            <div className="sm:col-span-1">
              <label htmlFor={`title-${tab}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {tab === 'en' ? 'Title' : 'العنوان'}
              </label>
              <input
                type="text"
                name="title"
                id={`title-${tab}`}
                value={getFieldValue('title', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={tab === 'en' ? 'Type project title' : 'اكتب عنوان المشروع'}
                disabled
                dir={tab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor={`place-${tab}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {tab === 'en' ? 'Place' : 'المكان'}
              </label>
              <input
                type="text"
                name="place"
                id={`place-${tab}`}
                value={getFieldValue('place', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={tab === 'en' ? 'Type project location' : 'اكتب موقع المشروع'}
                required
                dir={tab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Building and Square Feet */}
            <div className="sm:col-span-1">
              <label htmlFor={`building-${tab}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {tab === 'en' ? 'Building' : 'المبنى'}
              </label>
              <input
                type="text"
                name="building"
                id={`building-${tab}`}
                value={getFieldValue('building', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={tab === 'en' ? 'Type building name' : 'اكتب اسم المبنى'}
                dir={tab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor={`squarefeet-${tab}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {tab === 'en' ? 'Square Feet' : 'قدم مربع'}
              </label>
              <input
                type="number"
                name="squarefeet"
                id={`squarefeet-${tab}`}
                value={getFieldValue('squarefeet', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={tab === 'en' ? 'Type square footage' : 'اكتب المساحة بالقدم المربع'}
                dir={tab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label htmlFor={`image-${tab}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {tab === 'en' ? 'Featured Image' : 'الصورة الرئيسية'}
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id={`image-${tab}`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, tab)}
                    className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      {tab === 'en' ? 'Uploading...' : 'جارٍ التحميل...'}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <img
                    src={tab === 'en' ? imagePreviewEn : imagePreviewAr}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor={`description-${tab}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {tab === 'en' ? 'Description' : 'الوصف'}
              </label>
              <textarea
                name="description"
                id={`description-${tab}`}
                value={getFieldValue('description', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                rows={4}
                placeholder={tab === 'en' ? 'Type project description' : 'اكتب وصف المشروع'}
                dir={tab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Dropdowns */}
            {tab === 'en' ? (
              <>
                {renderDropdownCheckbox('amenities', 'Amenities', 'en')}
                {renderDropdownCheckbox('property_type', 'Property Type', 'en')}
                {renderDropdownCheckbox('payment_plan', 'Payment Plan', 'en')}
              </>
            ) : (
              <>
                {renderDropdownCheckbox('amenities', 'Amenities', 'ar')}
                {renderDropdownCheckbox('property_type', 'Property Type', 'ar')}
                {renderDropdownCheckbox('payment_plan', 'Payment Plan', 'ar')}
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="export-button mt-6"
          >
            {loading 
              ? (tab === 'en' ? 'Updating...' : 'جارٍ التحديث...') 
              : (tab === 'en' ? 'Update Project' : 'تحديث المشروع')}
          </button>
        </form>
        <ToastContainer position={tab === 'ar' ? 'top-left' : 'top-right'} />
      </div>
    </section>
  );
}

export default ProjectUpdate;