import React, { useEffect, useState } from 'react';
import { getNewsLetter } from '../../services/newsletterService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { paginate } from '../../services/paginate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 10;

function NewsletterCms() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const navigate = useNavigate();



  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const data = await getNewsLetter();
        setNewsletters(Array.isArray(data) ? data : data.data);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsletters();
  }, []);

  const totalPages = Math.ceil(newsletters.length / ITEMS_PER_PAGE);
  const paginatedNewsletters = paginate(newsletters, currentPage, ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const handleExport = () => {
    if (!newsletters.length) return;
    const header = ['Email', 'Subscribed At'];
    const rows = newsletters.map((n) => [
      n.email,
      n.createdAt ? format(new Date(n.createdAt), 'yyyy-MM-dd') : '',
    ]);
    const csvContent = [header, ...rows]
      .map((row) => row.map((val) => `"${val ?? ''}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-list.csv';
    a.click();
    URL.revokeObjectURL(url);
   
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r border-gray-200">
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between w-full mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Newsletter Subscriptions</h1>
          <button
            className="p-2 mr-4 text-white bg-green-600 border rounded-md border-1 hover:bg-green-700"
            onClick={handleExport}
          >
            Export Data
          </button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : newsletters && newsletters.length > 0 ? (
                paginatedNewsletters.map((newsletter, idx) => (
                  <tr key={newsletter.id || idx} className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td className="px-6 py-4">{newsletter.email}</td>
                    <td className="px-6 py-4">
                      {newsletter.createdAt
                        ? format(new Date(newsletter.createdAt), 'yyyy-MM-dd HH:mm')
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-400">
                    No newsletter subscriptions found.
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
      </div>
    </div>
  );
}

export default NewsletterCms;