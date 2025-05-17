import React, { useEffect, useState } from 'react';
import { fetchApartmentList } from '../../services/listService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';

const ITEMS_PER_PAGE = 5; // Change as needed

function ProjectList() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    async function fetchProjectList() {
      try {
        const data = await fetchApartmentList();
        const projects = Array.isArray(data) ? data : data.data;
        setProjectList(projects);
      } catch (error) {
        console.error('Error Fetching ProjectList', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectList();
  }, []);

  const totalPages = Math.ceil(projectList.length / ITEMS_PER_PAGE);
  const paginatedProjects = projectList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const handleUpdate = (project) => {
    navigate('/projectupdate', { state: { project } });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />
      <div className="p-4 w-full">
        <h2 className="text-xl font-bold mb-4">ProjectList Subscriptions</h2>

        {paginatedProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <>
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
                {paginatedProjects.map((project, index) => (
                  <tr key={project.id || index}>
                    <td className="py-2 px-4 border-b">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="py-2 px-4 border-b">{project.title}</td>
                    <td className="py-2 px-4 border-b">{project.place}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleUpdate(project)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-4 flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
