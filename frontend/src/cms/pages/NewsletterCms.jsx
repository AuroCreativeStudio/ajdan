import React, { useEffect, useState } from 'react';
import { getNewsLetter } from '../../services/newsletterService';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { logout } from '../../services/authService';

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
  const paginatedNewsletters = newsletters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />
      <div className="p-4 w-full">
        <h2 className="text-xl font-bold mb-4">Newsletter Subscriptions</h2>
        {paginatedNewsletters.length === 0 ? (
          <p>No newsletters found.</p>
        ) : (
          <>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">#</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Subscribed At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedNewsletters.map((newsletter, index) => (
                  <tr key={newsletter.id || index}>
                    <td className="py-2 px-4 border-b">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="py-2 px-4 border-b">{newsletter.email}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(newsletter.created_at).toLocaleString()}
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

export default NewsletterCms;
