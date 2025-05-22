import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProjectList } from '../../services/listService';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProjectUpdate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const project = state?.project;
 const arabicProject = project?.localizations?.find(loc => loc.locale === 'ar');

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login on logout
  };
  const [tab, setTab] = useState('en');
  const [form, setForm] = useState({
    title: project.title || '',
    place: project.place || '',
    building: project.building || '',
    squarefeet: project.square_feet || '',
    description: project.description || '',
    // amenities: project?.amenities || '',
    slug: project.slug || '',
  });

  const [formAr, setFormAr] = useState({
    title: arabicProject?.title || '',
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
        title: arabicProject.title || '',
        place: arabicProject.place || '',
        building: arabicProject.building || '',
        squarefeet: arabicProject.square_feet || '',
        description: arabicProject.description || '',
        slug: arabicProject.slug || '',
      });
    }
  }, [arabicProject]);

  //   const amenitiesOptions = [
  //     'Gym',
  //     'Swimming Pool',
  //     'Parking',
  //     'Security',
  //     'Garden',
  //     'Playground',
  //   ];

const handleChange = (e, locale = 'en') => {
  const { name, value } = e.target;
  if (locale === 'en') {
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  } else {
    setFormAr(prev => ({
      ...prev,
      [name]: value,
    }));
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // Update English
    await updateProjectList(project.documentId, {
      building: form.building,
      place: form.place,
      description: form.description,
      square_feet: Number(form.squarefeet),
      // amenities: form.amenities,
    }, 'en');
    // Update Arabic if exists
    if (arabicProject) {
      await updateProjectList(arabicProject.documentId, {
        building: formAr.building,
        place: formAr.place,
        description: formAr.description,
        square_feet: Number(formAr.squarefeet),
        // amenities: formAr.amenities,
      }, 'ar');
    }
    toast.success('Project updated successfully!');
    setTimeout(() => navigate(-1), 1500);
  } catch (error) {
    console.error('Update failed:', error);
    toast.error('Failed to update project.');
  } finally {
    setLoading(false);
  }
};
  if (!project) {
    return <div>No project data provided.</div>;
  }

  console.log('project:', project);
  console.log('localizations:', project?.localizations);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} /> {/* Use the Sidebar component */}
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Update Project</h2>
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
                <label className="block font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={e => handleChange(e, 'en')}
                  className="w-full border rounded px-3 py-2"
                  required
                  disabled
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Place</label>
                <input
                  type="text"
                  name="place"
                  value={form.place}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Building</label>
                <input
                  type="text"
                  name="building"
                  value={form.building}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Square Feet</label>
                <input
                  type="number"
                  name="squarefeet"
                  value={form.squarefeet}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              {/* <div>
              <label className="block font-medium mb-1">Amenities</label>
              <select
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select an amenity</option>
                {amenitiesOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div> */}
              <div>
                <label className="block font-medium mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  className="w-full border rounded px-3 py-2"
                  required
                  disabled // Remove disabled if editing allowed
                />
              </div>
            </>
          )}
          {tab === 'ar' && (
            <>
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formAr.title}
                  onChange={e => handleChange(e, 'ar')}
                  className="w-full border rounded px-3 py-2"
                  required
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Place</label>
                <input
                  type="text"
                  name="place"
                  value={formAr.place}
                  onChange={e => handleChange(e, 'ar')}
                  className="w-full border rounded px-3 py-2"
                  required
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Building</label>
                <input
                  type="text"
                  name="building"
                  value={formAr.building}
                  onChange={e => handleChange(e, 'ar')}
                  className="w-full border rounded px-3 py-2"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">SquareFeet</label>
                <input
                  type="number"
                  name="squarefeet"
                  value={formAr.squarefeet}
                  onChange={e => handleChange(e, 'ar')}
                  className="w-full border rounded px-3 py-2"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formAr.description}
                  onChange={e => handleChange(e, 'ar')}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  dir="rtl"
                />
              </div>
              {/* <div>
              <label className="block font-medium mb-1">المرافق</label>
              <select
                name="amenities"
                value={formAr.amenities}
                onChange={e => handleChange(e, 'ar')}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">اختر مرفقًا</option>
                {amenitiesOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div> */}

              <div>
                <label className="block font-medium mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formAr.slug}
                  className="w-full border rounded px-3 py-2"
                  required
                  dir="rtl"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Project'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ProjectUpdate;
