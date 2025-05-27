import React, { useEffect, useState } from 'react';
import { fetchApartmentListCMS } from '../../services/listService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
import { paginate } from '../../services/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 10;

function ProjectList() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
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
        const data = await fetchApartmentListCMS();
        const projects = Array.isArray(data) ? data : data.data || [];
        setProjectList(projects);
      } catch (error) {
        console.error('Error Fetching ProjectList', error);
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjectList();
  }, []);

  // const handleView = (project) => {
  //   setSelectedProject(project);
  //   setShowModal(true);
  // };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleUpdate = (project) => {
    navigate('/projectupdate', { state: { project } });
  };



  // Sort projectList by title ascending before paginating
  const sortedProjects = [...projectList].sort((a, b) => {
    if (!a.title) return -1;
    if (!b.title) return 1;
    return a.title.localeCompare(b.title);
  });
  const paginatedProjects = paginate(sortedProjects, currentPage, ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r border-gray-200">
        <Sidebar handleLogout={handleLogout} />
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between w-full mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Project List</h1>
          {/* <button
            className="p-2 mr-4 text-white bg-green-600 border rounded-md border-1 hover:bg-green-700"
            onClick={handleExport}
          >
            Export Data
          </button> */}
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Title (EN)</th>
                <th className="px-6 py-3">Title (AR)</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : projectList && projectList.length > 0 ? (
                paginatedProjects.map((project, idx) => (
                  <tr key={project.id || idx} className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td className="px-6 py-4">{project.title}</td>
                    <td className="px-6 py-4">
                      {
                        (project.title_ar !== undefined && project.title_ar !== null && project.title_ar !== '')
                          ? project.title_ar
                          : (project.title && project.title.Property_Title)
                            ? project.title.Property_Title
                            : (project.localizations && project.localizations.length > 0 && project.localizations[0].title && project.localizations[0].title.Property_Title)
                              ? project.localizations[0].title.Property_Title
                              : 'N/A'
                      }
                      
                    </td>
                    
                    <td className="px-6 py-4 ">
                      {/* <button
                        className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        onClick={() => handleView(project)}
                      >
                        View
                      </button> */}
                      <button
                        className="mr-4 text-green-600 hover:underline"
                        onClick={() => handleUpdate(project)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    No project data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
        </div>
        <ToastContainer />

        {showModal && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Project Details</h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-1 text-white rounded-full hover:bg-blue-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-gray-500">Title:</span>
                  <p className="text-gray-900">{selectedProject.title || 'N/A'}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">Place:</span>
                  <p className="text-gray-900">{selectedProject.place || 'N/A'}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">Area:</span>
                  <p className="text-gray-900">{selectedProject.area || 'N/A'}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">Status:</span>
                  <p>
                    <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                      selectedProject.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedProject.status || 'N/A'}
                    </span>
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">Description:</span>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedProject.description || 'No description provided'}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 text-right bg-gray-100">
                <button
                  onClick={handleCloseModal}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectList;