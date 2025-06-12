import React, { useEffect, useState } from 'react';
import { fetchApartmentListCMS } from '../../services/listService';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { paginate } from '../../services/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from '../../assets/image/one.jpg';

const ITEMS_PER_PAGE = 6;

function ProjectList() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const navigate = useNavigate();
  
   const lang = window.location.pathname.split('/')[1] || 'en'; 

  useEffect(() => {
    async function fetchProjectList() {
      try {
        const data = await fetchApartmentListCMS();
        const projects = Array.isArray(data) ? data : data.data || [];
        setProjectList(projects);
        console.log("data:",projects)
      } catch (error) {
        console.error('Error Fetching ProjectList', error);
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjectList();
  }, []);

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

  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <>
    <div className="flex h-screen bg-white">
      <div className="w-64 bg-white">
      </div>
      <div className="flex-1 flex flex-col overflow-hidden"> 
        <div className="flex items-center justify-between w-full p-6">
          <h1 className="text-3xl font-headline text-gray-800">Project List</h1>
        </div>
        <div className="flex-1 p-6">
          <div className="relative">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase font-headline  bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Feature Image</th>
                  <th className="px-6 py-3">Title (EN)</th>
                  <th className="px-6 py-3">Title (AR)</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="">
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : projectList && projectList.length > 0 ? (
                  paginatedProjects.map((project, idx) => (
                    <tr key={project.id || idx} className="bg-white border-b border-gray-200">
                  <td className="px-6 py-4">
                 <img src={image} alt="feature" className="w-20 h-14 object-cover rounded" />
                 </td>

                      <td className="px-6 py-4 font-body">{project.title}</td>
                      <td className="px-6 py-4 font-univers">
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
                      <td className="px-6 py-4 flex font-body items-center space-x-4">
  <button
    className="action-button flex items-center"
    onClick={() => handleUpdate(project)}
  >  
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1">
      <path d="M12 20H21M3 20H4.67454C5.16372 20 5.40832 20 5.63849 19.9447C5.84256 19.8957 6.03765 19.8149 6.2166 19.7053C6.41843 19.5816 6.59138 19.4086 6.93729 19.0627L19.5 6.5C20.3284 5.67157 20.3284 4.32843 19.5 3.5C18.6716 2.67157 17.3284 2.67157 16.5 3.5L3.93726 16.0627C3.59136 16.4086 3.4184 16.5816 3.29472 16.7834C3.18506 16.9624 3.10425 17.1574 3.05526 17.3615C3 17.5917 3 17.8363 3 18.3255V20Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"/>
    </svg>
    Edit
  </button>
  <Link
    to={`/${lang}/${project.slug}`}
    className="action-button flex items-center"
  >
    View
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1">
      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Link>
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
        </div>
        
        {/* Updated Pagination */}
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                className={`pagination-page-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-button"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
      <ToastContainer />
   </>
  );
}

export default ProjectList;