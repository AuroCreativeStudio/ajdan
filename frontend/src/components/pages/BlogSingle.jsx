import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogByDocumentId } from '../../services/blogService';

function BlogSingle() {
  const { id } = useParams(); // here `id` is actually documentId in the URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBlogByDocumentId(id)
        .then((res) => {
          const data = res.data?.data?.[0];
          setBlog(data);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

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
