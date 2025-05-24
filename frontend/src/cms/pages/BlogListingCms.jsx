import React, { useEffect, useState } from 'react';
import { fetchBlogs, deleteBlog } from '../../services/blogService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginate } from '../../services/paginate';

export default function BlogListingCms() {
  const { i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login on logout
  };

  useEffect(() => {
    fetchBlogs(i18n.language)
      .then(data => {
        console.log('Fetched blog data:', data);
        const sanitizedBlogs = (data?.data || []).map(blog => {
          return {
            id: blog.documentId,
            slug: blog.slug || '',
            title: blog.title || 'Untitled',
            meta_description: blog.meta_description || 'N/A',
            descriptionBlocks: Array.isArray(blog.description_1) ? blog.description_1 : [],
            imageUrl: blog.featured_image?.url || null,
            altText: blog.alt_text_image || 'No description',
          };
        });

        setBlogs(sanitizedBlogs);
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      });
  }, [i18n.language]);


// In your component
const handleDelete = async (documentId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete the blog?");
  if (!confirmDelete) return;

  try {
    console.log("Trying to delete:", documentId);
    await deleteBlog(documentId);
    toast.success("Blog deleted successfully"); // ✅ Toast on success

    // Optionally remove the blog from state without refetching
    setBlogs(prev => prev.filter(blog => blog.id !== documentId));
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);
    toast.error("Failed to delete blog"); // ✅ Toast on error
  }
};


  const ITEMS_PER_PAGE = 10; // Define how many items you want per page
  const paginatedBlogs = paginate(blogs, currentPage, ITEMS_PER_PAGE);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between w-full mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Blogs</h1>
          <button
            onClick={() => navigate('/create')}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Slug</th>
                <th scope="col" className="px-6 py-3">Meta-Description</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBlogs.length > 0 ? (
                paginatedBlogs.map((blog) => (
                  <tr key={blog.id} className="bg-white border-b border-gray-200">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {blog.title}
                    </th>
                    <td className="px-6 py-4">{blog.slug}</td>
                    <td className="px-6 py-4">{blog.meta_description}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/edit/${blog.slug}`}
                        state={{ slug: blog.slug }}
                        className="mr-4 text-green-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                    No blogs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex mt-4 space-x-2">
          {Array.from({ length: Math.ceil(blogs.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
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
