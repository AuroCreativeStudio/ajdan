import React, { useEffect, useState } from 'react';
import { getNewsLetter } from '../../services/newsletterService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';
import { format } from 'date-fns';
import { paginate } from '../../services/paginate'; // <-- Import here

const ITEMS_PER_PAGE = 10; // Adjust as needed

function NewsletterCms() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
  const paginatedNewsletters = paginate(newsletters, currentPage, ITEMS_PER_PAGE); // <-- Use here

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  // Export data as CSV (Excel-compatible)
  const handleExport = () => {
    if (!newsletters.length) return;
    const header = [ 'Email', 'Subscribed At'];
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Newsletter Subscriptions</h2>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Export Data
          </button>
        </div>
        {paginatedNewsletters.length === 0 ? (
          <p>No newsletters found.</p>
        ) : (
          <>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">#</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Subscribed At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedNewsletters.map((newsletter, index) => (
                  <tr key={newsletter.id || index}>
                    <td className="px-4 py-2 border-b">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-4 py-2 border-b">{newsletter.email}</td>
                    <td className="px-4 py-2 border-b">
                      {newsletter.createdAt
                        ? format(new Date(newsletter.createdAt), 'yyyy-MM-dd HH:mm')
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex mt-4 space-x-2">
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

export default NewsletterCms;
