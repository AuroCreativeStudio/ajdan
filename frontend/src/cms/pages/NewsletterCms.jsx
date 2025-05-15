import React, { useEffect, useState } from 'react';
import { getNewsLetter } from '../../services/newsletterService'; // <-- Fix import

function NewsletterCms() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const data = await getNewsLetter(); // <-- Use correct function
        // If your API returns { data: [...] }, use data.data
        setNewsletters(Array.isArray(data) ? data : data.data);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsletters();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Newsletter Subscriptions</h2>
      {newsletters.length === 0 ? (
        <p>No newsletters found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {newsletters.map((newsletter, index) => (
              <tr key={newsletter.id || index}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{newsletter.email}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(newsletter.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NewsletterCms;
