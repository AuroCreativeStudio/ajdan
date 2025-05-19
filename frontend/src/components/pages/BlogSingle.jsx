import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogByDocumentId } from '../../services/blogService';

function BlogSingle() {
  const { slug } = useParams(); // URL param
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always fetch by slug
        const res = await fetchBlogByDocumentId(null, slug); // Pass slug as a query parameter
        const data = res?.data;
        // Set blog to the first item in the array, or null if not found
        setBlog(Array.isArray(data) && data.length > 0 ? data[0] : null);
      } catch (err) {
        console.error('Error fetching blog:', err);
      }
    };

    fetchData();
  }, [slug]);

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
