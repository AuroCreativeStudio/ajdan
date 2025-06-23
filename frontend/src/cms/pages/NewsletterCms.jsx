import React, { useEffect, useState } from 'react';
import { getNewsLetter, deleteNewsletter } from '../../services/newsletterService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { paginate } from '../../services/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeletePopup from './DeletePopup';

function NewsletterCms() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const navigate = useNavigate();
  
  const pageSize = 20;
  
  const paginatedNewsletters = paginate(newsletters, currentPage, pageSize);
  const totalPages = Math.ceil(newsletters.length / pageSize);

  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const data = await getNewsLetter();
        setNewsletters(Array.isArray(data) ? data : data.data);
        console.log("data:", data);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsletters();
  }, []);

 const handleExport = () => {
  if (!newsletters.length) return;

  // Updated header to include IP
  const header = ['Email', 'IP Address', 'Subscribed At'];

  // Updated rows to include IP
  const rows = newsletters.map((n) => [
    n.email,
    n.ip || 'N/A',
    n.createdAt ? format(new Date(n.createdAt), 'yyyy-MM-dd HH:mm') : '',
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((val) => `"${val ?? ''}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'newsletter-subscribers.csv';
  a.click();
  URL.revokeObjectURL(url);
};

   
  const nextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const goToPage = (page) => {
    setSearchParams({ page });
  };

const handleDelete = async (documentId) => {
  try {
    const itemToDelete = newsletters.find(n => n.documentId === documentId);
    if (!itemToDelete) {
      toast.error('Item not found');
      return;
    }

    await deleteNewsletter(documentId);
    toast.success("Subscription deleted successfully");
    setNewsletters(prev => prev.filter(newsletter => newsletter.documentId !== documentId));
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to delete subscription");
  }
};


  return (
    <div className="flex h-screen bg-white">
      <div className="w-64 bg-white"></div>
      <div className="flex-1 flex flex-col "> 
        <div className="flex items-center justify-between w-full p-6">
          <h1 className="text-3xl text-gray-800 font-headline">Newsletter Subscriptions</h1>
          <button onClick={handleExport} className="export-button">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 30 30" 
              width="20" 
              height="20" 
              className="text-green-600 group-hover:text-white font-headline"
            >
              <path 
                fill="currentColor" 
                d="M 15 3 A 2 2 0 0 0 14.599609 3.0429688 L 14.597656 3.0410156 L 4.6289062 5.0351562 L 4.6269531 5.0371094 A 2 2 0 0 0 3 7 L 3 23 A 2 2 0 0 0 4.6289062
                24.964844 L 14.597656 26.958984 A 2 2 0 0 0 15 27 A 2 2 0 0 0 17 25 L 17 5 A 2 2 0 0 0 15 3 z M 19 5 L 19 8 L 21 8 L 21 10 L 19 10 L 19 12 L 21 12 L 21
                14 L 19 14 L 19 16 L 21 16 L 21 18 L 19 18 L 19 20 L 21 20 L 21 22 L 19 22 L 19 25 L 25 25 C 26.105 25 27 24.105 27 23 L 27 7 C 27 
                5.895 26.105 5 25 5 L 19 5 z M 23 8 L 24 8 C 24.552 8 25 8.448 25 9 C 25 9.552 24.552 10 24 10 L 23 10 L 23 8 z M 6.1855469 10 L 8.5878906
                10 L 9.8320312 12.990234 C 9.9330313 13.234234 10.013797 13.516891 10.091797 13.837891 L 10.125 13.837891 C 10.17 13.644891 10.258531 13.351797
                10.394531 12.966797 L 11.785156 10 L 13.972656 10 L 11.359375 14.955078 L 14.050781 19.998047 L 11.716797 19.998047 L 10.212891 16.740234 C 10.155891
                16.625234 10.089203 16.393266 10.033203 16.072266 L 10.011719 16.072266 C 9.9777187 16.226266 9.9105937 16.458578 9.8085938 16.767578 L 8.2949219 20 L 5.9492188 
                20 L 8.7324219 14.994141 L 6.1855469 10 z M 23 12 L 24 12 C 24.552 12 25 12.448 25 13 C 25 13.552 24.552 14 24 14 L 23 14 L 23 12 z M 23 16 L 24 16 C 24.552 16 25
                16.448 25 17 C 25 17.552 24.552 18 24 18 L 23 18 L 23 16 z M 23 20 L 24 20 C 24.552 20 25 20.448 25 21 C 25 21.552 24.552 22 24 22 L 23 22 L 23 20 z"
              />
            </svg>
            Export Data
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 pb-4">
          <div className="bg-white rounded-lg shadow-sm">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-headline">
                <tr>
                  <th className="px-6 py-3">s.no</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">IP Address</th>
                  <th className="px-6 py-3">Subscribed At</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : newsletters.length > 0 ? (
                  paginatedNewsletters.map((newsletter, idx) => (
                    <tr key={newsletter.id || idx} className="bg-white border-b font-body border-gray-200">
                      <td className="px-6 py-4">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="px-6 py-4">{newsletter.email}</td>
                      <td className="px-6 py-4">{newsletter.ip}</td>
                      <td className="px-6 py-4">
                        {newsletter.createdAt
                          ? format(new Date(newsletter.createdAt), 'yyyy-MM-dd HH:mm')
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
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
                          message={`Are you sure you want to delete the subscription "${newsletter.email}"?`}
                          itemId={newsletter.documentId}
                         onConfirm={() => handleDelete(newsletter.documentId)}

                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                      No newsletter subscriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
                  onClick={() => goToPage(page)}
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
        <ToastContainer />
      </div>
    </div>
  );
}

export default NewsletterCms;