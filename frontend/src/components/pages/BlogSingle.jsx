import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchBlogByDocumentId } from '../../services/blogService';

function BlogSingle() {
  const { slug } = useParams(); // URL param
  const location = useLocation();
  const documentIdFromState = location.state?.documentId;
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch by documentId first if it's passed via navigation
        if (documentIdFromState) {
          const res = await fetchBlogByDocumentId(documentIdFromState);
          const data = res.data?.data?.[0];
          if (data) {
            setBlog(data);
            return;
          }
        }

        // Fallback: try to fetch by slug
        const res = await fetchBlogByDocumentId(slug);
        const data = res.data?.data?.[0];
        setBlog(data);
      } catch (err) {
        console.error('Error fetching blog:', err);
      }
    };

    fetchData();
  }, [slug, documentIdFromState]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.meta_description}</p>
      {/* Render other blog data */}
    </div>
  );
}

export default BlogSingle;
