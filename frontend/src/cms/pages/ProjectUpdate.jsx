import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProjectList } from '../../services/listService';

function ProjectUpdate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const project = state?.project;

  const [form, setForm] = useState({
    title: project.title || '',
    place: project.place || '',
    building: project.building || '',
    squarefeet:  project.square_feet || '',
    description: project.description || '',
    // amenities: project?.amenities || '',
    slug: project.slug || '',
  });

  const [loading, setLoading] = useState(false);

//   const amenitiesOptions = [
//     'Gym',
//     'Swimming Pool',
//     'Parking',
//     'Security',
//     'Garden',
//     'Playground',
//   ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
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
        // amenities: form.amenities,
      });
      alert('Project updated successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update project.');
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div>No project data provided.</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Update Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            className="w-full border rounded px-3 py-2"
            required
            disabled // Remove disabled if editing allowed
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
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Project'}
        </button>
      </form>
    </div>
  );
}

export default ProjectUpdate;
