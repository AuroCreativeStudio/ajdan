import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProjectList } from '../../services/listService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProjectUpdate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const project = state?.project;
  const arabicProject = project?.localizations?.find(loc => loc.locale === 'ar');

  const [tab, setTab] = useState('en');
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

  const [form, setForm] = useState({
    title: project?.title || '',
    place: project?.place || '',
    building: project?.building || '',
    squarefeet: project?.square_feet || '',
    description: project?.description || '',
    amenities_en: project?.amenities_en || defaultAmenitiesEn,
    property_type_en: project?.property_type_en || defaultPropertyTypesEn,
    payment_plan_en: project?.payment_plan_en || defaultPaymentPlansEn
  });

  const [formAr, setFormAr] = useState({
    title: project?.title_ar || arabicProject?.title || '',
    place: arabicProject?.place || '',
    building: arabicProject?.building || '',
    squarefeet: arabicProject?.square_feet || '',
    description: arabicProject?.description || '',
    amenities_ar: arabicProject?.amenities_ar || defaultAmenitiesAr,
    property_type_ar: arabicProject?.property_type_ar || defaultPropertyTypesAr,
    payment_plan_ar: arabicProject?.payment_plan_ar || defaultPaymentPlansAr
  });

  const [loading, setLoading] = useState(false);

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
        payment_plan_en: project.payment_plan_en || defaultPaymentPlansEn
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
        payment_plan_ar: arabicProject?.payment_plan_ar || defaultPaymentPlansAr
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProjectList(project.documentId, {
        building: form.building,
        place: form.place,
        description: form.description,
        square_feet: Number(form.squarefeet),
        amenities_en: form.amenities_en,
        property_type_en: form.property_type_en,
        payment_plan_en: form.payment_plan_en,
      }, 'en');

      if (arabicProject?.id) {
        await updateProjectList(arabicProject.documentId, {
          building: formAr.building,
          place: formAr.place,
          description: formAr.description,
          square_feet: Number(formAr.squarefeet),
          amenities_ar: formAr.amenities_ar,
          property_type_ar: formAr.property_type_ar,
          payment_plan_ar: formAr.payment_plan_ar,
        }, 'ar');
      } else if (project.title_ar) {
        await updateProjectList(project.documentId, {
          title_ar: formAr.title,
        }, 'en');
      }

      toast.success('Project updated successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update project.');
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
    
    // Get the appropriate options based on field and locale
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
            {/* Title and Place in one row (2 columns) */}
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

            {/* Building and Square Feet in one row (2 columns) */}
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

            {/* Description (full width) */}
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
        <ToastContainer />
      </div>
    </section>
  );
}

export default ProjectUpdate;