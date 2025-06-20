import React, { useEffect, useState } from 'react';
import { fetchteam, deleteTeam } from '../../services/aboutusService';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginate } from '../../services/paginate';
import DeletePopup from './DeletePopup';

function getImageUrl(image) {
  if (!image) return "https://docs.material-tailwind.com/img/team-3.jpg";
  if (typeof image === "string") return image;
  if (image.url) return image.url.startsWith("http") ? image.url : `http://localhost:1337${image.url}`;
  return "https://docs.material-tailwind.com/img/team-3.jpg";
}

const ITEMS_PER_PAGE = 6;

function TeamList() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [showModal, setShowModal] = useState(false);
  // const [selectedMember, setSelectedMember] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const [activeTab, setActiveTab] = useState('board'); // 'board' or 'team'
  const navigate = useNavigate();

  useEffect(() => {
    async function getTeam() {
      try {
        const data = await fetchteam();
        setTeam(Array.isArray(data) ? data : data.data);
        console.log("data",data);
            } catch (error) {
        setTeam([]);
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    }
    getTeam();
  }, []);

  const handleDelete = async (documentId) => {
    try {
      await deleteTeam(documentId);
      setTeam((prev) => prev.filter((member) => member.documentId !== documentId));
      toast.success('Team member deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete team member.');
    }
  };

  const filteredTeam = team.filter((member) =>
    activeTab === 'board'
      ? member.role_en?.toLowerCase().includes('board')
      : member.role_en?.toLowerCase().includes('team')
  );

  // Sort team by name ascending before paginating
  const sortedTeam = [...filteredTeam].sort((a, b) => {
    const nameA = a.name || a.member || '';
    const nameB = b.name || b.member || '';
    return nameA.localeCompare(nameB);
  });

  const paginatedTeam = paginate(sortedTeam, currentPage, ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedTeam.length / ITEMS_PER_PAGE);

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
        <div className="w-64 bg-white"></div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between w-full p-6">
            <h1 className="text-3xl text-gray-800 font-headline">
              {activeTab === 'board' ? 'Board of Directors' : 'Team'} List
            </h1>
            <button
              onClick={() => navigate('/teamcreate')}
              className="export-button"
            >
              Create
            </button>
          </div>
          
          {/* Tabs */}
          <div className="px-6">
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                  <button
                    onClick={() => {
                      setActiveTab('board');
                      handlePageChange(1);
                    }}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'board'
                        ? 'text-blue-600 border-blue-600'
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Board of Directors
                  </button>
                </li>
                <li className="me-2">
                  <button
                    onClick={() => {
                      setActiveTab('team');
                      handlePageChange(1);
                    }}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'team'
                        ? 'text-blue-600 border-blue-600'
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Team
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6 pb-4">
            <div className="bg-white rounded-lg shadow-sm">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-headline">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : sortedTeam.length > 0 ? (
                    paginatedTeam.map((member, idx) => (
                      <tr key={member.documentId || idx} className="bg-white border-b font-body border-gray-200">
                        <td className="px-6 py-4">{((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1}</td>
                        <td className="px-6 py-4">{member.name || member.member || 'N/A'}</td>
                        <td className="px-6 py-4">{member.role_en || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <img
                            src={getImageUrl(member.image)}
                            alt={member.name || "profile"}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="action-button mr-2"
                            onClick={() => navigate('/teamupdate', { state: { member } })}
                          >  
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 20H21M3 20H4.67454C5.16372 20 5.40832 20 5.63849 19.9447C5.84256 19.8957 6.03765 19.8149 6.2166 19.7053C6.41843 19.5816 6.59138 19.4086 6.93729 19.0627L19.5 6.5C20.3284 5.67157 20.3284 4.32843 19.5 3.5C18.6716 2.67157 17.3284 2.67157 16.5 3.5L3.93726 16.0627C3.59136 16.4086 3.4184 16.5816 3.29472 16.7834C3.18506 16.9624 3.10425 17.1574 3.05526 17.3615C3 17.5917 3 17.8363 3 18.3255V20Z" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </button>
                          <DeletePopup
                            customTrigger={
                              <button className="action-button ml-2">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                  <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"/>
                                </svg>
                                Delete
                              </button>
                            }
                            message={`Are you sure you want to delete "${member.name || 'this member'}"?`}
                            itemId={member.documentId}
                            onConfirm={() => handleDelete(member.documentId)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container mb-0">
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
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default TeamList;