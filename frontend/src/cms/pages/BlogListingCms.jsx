import React, { useEffect, useState } from 'react';
import { fetchBlogs, deleteBlog } from '../../services/blogService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginate } from '../../services/paginate';
import DeletePopup from './DeletePopup';

export default function BlogListingCms() {
  const { i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [toDate, setToDate] = useState(''); 

  const pageSize = 6;
  const paginatedBlogs = paginate(filteredBlogs.length > 0 ? filteredBlogs : blogs, currentPage, pageSize);
  
  const totalPages = Math.ceil((filteredBlogs.length > 0 ? filteredBlogs : blogs).length / pageSize);

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    return () => {
      document.documentElement.dir = i18n.dir();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
  
      try {
        const [englishData, arabicData] = await Promise.all([
          fetchBlogs('en'),
          fetchBlogs('ar')
        ]);

        const sanitizedBlogs = (englishData?.data || []).map(blog => {
              console.log("News data:", blog);
          const arabicBlog = arabicData?.data?.find(b => b.documentId === blog.documentId);
          return {
            id: blog.documentId,
            date:blog.date || 'dd-mm-yyyy',
            slug: blog.slug || '',
            title: blog.title || 'Untitled',
            meta_description: blog.meta_description || 'N/A',
            descriptionBlocks: Array.isArray(blog.description_1) ? blog.description_1 : [],
            imageUrl: blog.featured_image?.url || null,
            altText: blog.alt_text_image || 'No description',
            arabicTitle: arabicBlog?.title || 'Untitled (Arabic)',
            arabicSlug: arabicBlog?.slug || '',
            arabicMetaDescription: arabicBlog?.meta_description || 'N/A (Arabic)',
            publish: blog.publish ?? false,
          };
        });
        setBlogs(sanitizedBlogs);
        setFilteredBlogs(sanitizedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
        setFilteredBlogs([]);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (documentId) => {
    try {
      await deleteBlog(documentId);
      toast.success("Blog deleted successfully");
      setBlogs(prev => prev.filter(blog => blog.id !== documentId));
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      toast.error("Failed to delete blog");
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

const toggleFilterDropdown = () => {
    setIsFilterOpen(prev => !prev); // 👈 Toggle dropdown
  };

 const applyDateFilter = () => {
  // Check if both date fields are empty
  if (!fromDate && !toDate) {
    toast.error("Please select at least one date (From or To) to filter");
    return;
  }

  // Validate date range if both dates are provided
  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    toast.error("'From' date cannot be after 'To' date");
    return;
  }

  const filtered = blogs.filter(blog => {
    const blogDate = new Date(blog.date);
    const from = fromDate ? new Date(fromDate) : new Date(0); // Default to earliest date if fromDate not set
    const to = toDate ? new Date(toDate) : new Date(); // Default to current date if toDate not set

    return blogDate >= from && blogDate <= to;
  });

  // Check if any results were found
  if (filtered.length === 0) {
    toast.info("No blogs found for the selected date range");
    setFilteredBlogs([]); // Clear any previous filters
  } else {
    setFilteredBlogs(filtered);
    toast.success(`Found ${filtered.length} blog(s)`);
  }

  setCurrentPage(1); // Reset to first page after filtering
  setIsFilterOpen(false); // Close the filter dropdown
};

  return (
    <div className="flex h-screen bg-white ">
      <div className="w-64"></div>
      <div className="flex-1">
        <div className="flex items-center justify-between w-full mb-6">
          <h1 className="text-3xl font-headline text-gray-800">News</h1>



 <div className="flex items-center space-x-4">
  <div className="relative inline-block text-left">
    <button
      onClick={toggleFilterDropdown}
      className="export-button flex items-center"
    >
      Filter with tabs
      <svg 
        className="ml-2 h-5 w-5" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M19 9l-7 7-7-7" 
        />
      </svg>
    </button>

    {isFilterOpen && (
      <div className="origin-top-right absolute right-0 z-50 mt-2 w-80 rounded-lg shadow-lg bg-white ring-1 ring-gray-200">
        <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
          <span className="font-medium text-gray-900">Filter Date</span>
        </div>
        <div className="px-4 py-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={applyDateFilter}
            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Filter
          </button>
          {filteredBlogs.length > 0 && (
            <button
              onClick={() => {
                setFilteredBlogs([]);
                setFromDate('');
                setToDate('');
                setCurrentPage(1);
              }}
              className="w-full mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
    )}
  </div>
</div>
          <button
            onClick={() => navigate('/create')}
            className="export-button"
          >
            Create
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 font-headline">Date</th>
                <th scope="col" className="px-6 py-3 font-headline">Title</th>
                <th scope="col" className="px-6 py-3 font-headline">Status</th>
                <th scope="col" className="px-6 py-3 font-headline">Actions</th>
              </tr>
            </thead>
            <tbody>
               {paginatedBlogs.length > 0 ? (
    paginatedBlogs.map((blog) => (
      <tr key={blog.id} className="bg-white border-b border-gray-200">
       <td className="px-6 py-4">
  {blog.date
    ? new Date(blog.date).toLocaleDateString('en-GB')
    : "dd-mm-yyyy"}
</td>


        {/* Title column */}
        <td className="px-6 py-4">
          <div>
            <p className="font-medium">{blog.title}</p>
            {blog.arabicTitle && (
              <p className="mt-2 text-right text-gray-600 font-univers">
                {blog.arabicTitle}
              </p>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
     <span
       className={`inline-block px-3 py-1 text-sm rounded-full ${
        blog.publish ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
     }`}
    >
    {blog.publish ? 'Published' : 'Draft'}
    </span>
   </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex">
                          <Link
                            to={`/edit/${blog.slug}`}
                            state={{ slug: blog.slug }}
                            className="action-button ml-2"
                          > 
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 20H21M3 20H4.67454C5.16372 20 5.40832 20 5.63849 19.9447C5.84256 19.8957 6.03765 19.8149 6.2166 19.7053C6.41843 19.5816 6.59138
                              19.4086 6.93729 19.0627L19.5 6.5C20.3284 5.67157 20.3284 4.32843 19.5 3.5C18.6716 2.67157 17.3284 2.67157 16.5 3.5L3.93726 16.0627C3.59136 16.4086
                              3.4184 16.5816 3.29472 16.7834C3.18506 16.9624 3.10425 17.1574 3.05526 17.3615C3 17.5917 3 17.8363 3 18.3255V20Z" stroke="currentColor" strokeWidth="2" 
                              strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </Link>
                          
                          <DeletePopup
                            customTrigger={
                              <button className="action-button ml-2">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142
                                  2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086
                                  21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"/>
                                </svg>
                                Delete
                              </button>
                            }
                            message={`Are you sure you want to delete the blog "${blog.title}"?`}
                            itemId={blog.id}
                            onConfirm={() => handleDelete(blog.id)}
                          />
                          
                          <Link
                            to={`/en/blog/${blog.slug}`} 
                            state={{ documentId: blog.id }}
                            className="action-button ml-2"
                          >
                            View
                            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>

                          {blog.arabicSlug && (
                            <Link
                              to={`/ar/blog/${blog.slug}`} 
                              state={{ documentId: blog.id }}
                              className="action-button ml-2"
                            >
                              عرض
                              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
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
                onClick={() => setCurrentPage(page)}
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
        <ToastContainer />
      </div>
    </div>
  );
}