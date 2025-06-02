import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProjectList } from '../../services/listService';
// import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProjectUpdate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const project = state?.project;
  const arabicProject = project?.localizations?.find(loc => loc.locale === 'ar');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
    console.log("data:", project);
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
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium text-gray-700 capitalize">{label}</label>
        <div 
          className={`w-full border rounded px-3 py-2 cursor-pointer flex justify-between items-center ${
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
          <div className={`absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto ${
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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-grow p-6">
        <div className="max-w-3xl p-6 mx-auto bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Update Project</h2>

          <div className="flex mb-6 border-b">
            <button
              type="button"
              onClick={() => setTab('en')}
              className={`px-5 py-2 text-sm font-medium border-b-2 transition ${
                tab === 'en'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setTab('ar')}
              className={`px-5 py-2 text-sm font-medium border-b-2 transition ${
                tab === 'ar'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600'
              }`}
            >
              Arabic
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {['title', 'place', 'building', 'squarefeet', 'description'].map((field) => (
              <div key={field}>
                <label className="block mb-1 font-medium text-gray-700 capitalize">
                  {field === 'squarefeet' ? 'Square Feet' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {field === 'description' ? (
                  <textarea
                    name={field}
                    value={getFieldValue(field, tab)}
                    onChange={(e) => handleChange(e, tab)}
                    className={`w-full border rounded px-3 py-2 ${
                      tab === 'ar' ? 'text-right' : ''
                    } ${field === 'title' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    rows={3}
                    dir={tab === 'ar' ? 'rtl' : 'ltr'}
                    disabled={field === 'title'}
                  />
                ) : (
                  <input
                    type={field === 'squarefeet' ? 'number' : 'text'}
                    name={field}
                    value={getFieldValue(field, tab)}
                    onChange={(e) => handleChange(e, tab)}
                    className={`w-full border rounded px-3 py-2 ${
                      tab === 'ar' ? 'text-right' : ''
                    } ${field === 'title' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    dir={tab === 'ar' ? 'rtl' : 'ltr'}
                    required={field !== 'building'}
                    disabled={field === 'title'}
                  />
                )}
              </div>
            ))}

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

            <div className="pt-4">
              <button
                type="submit"
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded text-white w-full transition ${
                  loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={loading}
              >
                {loading && (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.043 2A8.978 8.978 0 0112 21a8.978 8.978 0 01-7.625-4.042M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
                {loading ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ProjectUpdate;