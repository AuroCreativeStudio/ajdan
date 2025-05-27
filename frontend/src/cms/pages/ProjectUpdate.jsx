import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProjectList } from '../../services/listService';
import { useTranslation } from 'react-i18next';
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
  const [form, setForm] = useState({
    title: project?.title || '',
    place: project?.place || '',
    building: project?.building || '',
    squarefeet: project?.square_feet || '',
    description: project?.description || '',
    slug: project?.slug || '',
  });

  // Modified Arabic form initialization
  const [formAr, setFormAr] = useState({
    title: arabicProject?.title?.Property_Title || '',
    place: arabicProject?.place || '',
    building: arabicProject?.building || '',
    squarefeet: arabicProject?.square_feet || '',
    description: arabicProject?.description || '',
    slug: arabicProject?.slug || '',
  });

  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (arabicProject) {
    setFormAr({
      title: arabicProject.title?.Property_Title || arabicProject.title || '',
      place: arabicProject.place || '',
      building: arabicProject.building || '',
      squarefeet: arabicProject.square_feet || '',
      description: arabicProject.description || '',
      slug: arabicProject.slug || '',
    });
  }
}, [arabicProject]);



  const handleChange = (e, locale = 'en') => {
    const { name, value } = e.target;
    if (locale === 'en') {
      setForm(prev => ({ ...prev, [name]: value }));
    } else {
      setFormAr(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update English project
      await updateProjectList(project.documentId, {
        building: form.building,
        place: form.place,
        description: form.description,
        square_feet: Number(form.squarefeet),
      }, 'en');

      // Update Arabic project if exists
      if (arabicProject?.id) {
        await updateProjectList(arabicProject.documentId, {
    
          building: formAr.building,
          place: formAr.place,
          description: formAr.description,
          square_feet: Number(formAr.squarefeet),
        }, 'ar');
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

  // Modified getFieldValue function
const getFieldValue = (field, locale) => {
  if (locale === 'en') return form[field];
  if (field === 'title') {
    // Defensive: handle cases where arabicProject or title is undefined
    if (!arabicProject) return '';
    // If title is undefined but title_ar exists (from fetchApartmentListCMS), use that
    if (arabicProject.title_ar) return arabicProject.title_ar;
    // If title is an object with Property_Title
    if (arabicProject.title && arabicProject.title.Property_Title)
      return arabicProject.title.Property_Title;
    // If title is a string
    if (typeof arabicProject.title === 'string') return arabicProject.title;
    // Fallback to formAr.title
    return formAr.title || '';
  }
  return formAr[field];
};



  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-grow p-6">
        <div className="max-w-3xl p-6 mx-auto bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Update Project</h2>

          {/* Language Tabs */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {['title', 'place', 'building', 'squarefeet', 'description', 'slug'].map((field) => (
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
                    }`}
                    rows={3}
                    dir={tab === 'ar' ? 'rtl' : 'ltr'}
                  />
                ) : (
                  <input
                    type={field === 'squarefeet' ? 'number' : 'text'}
                    name={field}
                    value={getFieldValue(field, tab)}
                    onChange={(e) => handleChange(e, tab)}
                    className={`w-full border rounded px-3 py-2 ${tab === 'ar' ? 'text-right' : ''}`}
                    dir={tab === 'ar' ? 'rtl' : 'ltr'}
                    required={field !== 'building'}
                    disabled={['title', 'slug'].includes(field)}
                  />
                )}
              </div>
            ))}

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