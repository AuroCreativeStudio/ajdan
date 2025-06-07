import React, { useEffect, useState } from 'react';
import { fetchteam, deleteTeam } from '../../services/aboutusService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginate } from '../../services/paginate';

function getImageUrl(image) {
  if (!image) return "https://docs.material-tailwind.com/img/team-3.jpg";
  if (typeof image === "string") return image;
  if (image.url) return image.url.startsWith("http") ? image.url : `http://localhost:1337${image.url}`;
  return "https://docs.material-tailwind.com/img/team-3.jpg";
}

function TeamList() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();


  useEffect(() => {
    async function getTeam() {
      try {
        const data = await fetchteam();
        setTeam(Array.isArray(data) ? data : data.data);
      } catch (error) {
        setTeam([]);
      } finally {
        setLoading(false);
      }
    }
    getTeam();
  }, []);

  // Delete handler
  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteTeam(documentId);
        setTeam((prev) => prev.filter((member) => member.documentId !== documentId));
        toast.success('Team member deleted successfully!'); // Success toaster
      } catch (error) {
        toast.error('Failed to delete team member.');
      }
    }
  };

  const ITEMS_PER_PAGE = 10; // Define how many items you want per page
  const paginatedContacts = paginate(team, currentPage, ITEMS_PER_PAGE);

  return (
    
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r border-gray-200">
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between w-full mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Team List</h1>
          <button
            className="p-2 mr-4 text-white bg-blue-800 border rounded-md border-1"
            onClick={() => navigate('/teamcreate')}
          >
            Create
          </button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
              ) : team && team.length > 0 ? (
                paginatedContacts.map((member, idx) => (
                  <tr key={member.id || member.documentId || idx} className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">{member.name || member.member || 'N/A'}</td>
                    <td className="px-6 py-4">{member.role || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <img
                        src={getImageUrl(member.image)}
                        alt={member.name || "profile"}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </td>
                    <td className="flex gap-2 px-6 py-4">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          console.log(member);
                          navigate('/teamupdate', { state: { member } });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(member.documentId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex mt-4 space-x-2">
          {Array.from({ length: Math.ceil(team.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default TeamList;