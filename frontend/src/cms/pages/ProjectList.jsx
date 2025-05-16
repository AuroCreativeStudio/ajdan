import React, { useEffect, useState } from 'react'
import { fetchApartmentList } from '../../services/listService';
import { useNavigate } from 'react-router-dom';

function ProjectList() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

 useEffect(() => {
    async function fetchProjectList() {
      try {
        const data = await fetchApartmentList();
        const projects = Array.isArray(data) ? data : data.data;

  
        const projectsWithDocId = projects.map(project => ({
          ...project,
         
        }));

        setProjectList(projectsWithDocId);
      } catch (error) {
        console.error('Error Fetching ProjectList', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectList();
  }, []);

  if (loading) return <div>Loading...</div>;



  if (loading) return <div>Loading...</div>
const handleUpdate = (project) => {
  navigate('/projectupdate', { state: { project } });
};

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ProjectList Subscriptions</h2>
      {projectList.length === 0 ? (
        <p>No ProjectList found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Place</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {projectList.map((project, index) => (
              <tr key={project.id || index}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{project.title}</td>
                <td className="py-2 px-4 border-b">{project.place}</td>
                <td className="py-2 px-4 border-b">
               <button
  onClick={() => handleUpdate(project)}
  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
>
  Update
</button>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ProjectList