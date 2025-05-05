import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogBySlug } from '../../services/blogService';
import parse from 'html-react-parser'; // Import html-react-parser for rich text rendering

function BlogSingle({ locale = 'en' }) {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlogBySlug(slug, locale).then(data => {
      if (data.data.length) setBlog(data.data[0]);
    });
  }, [slug, locale]);

  if (!blog) return <p>Loading...</p>;

  const content = blog.attributes;

  return (
    <div className="blog-single" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{content.title}</h1>
      {content.featured_image?.data?.attributes?.url && (
        <img
          src={content.featured_image.data.attributes.url}
          alt={content.alt_text_image || 'Blog image'}
          style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
        />
      )}
      {content.description_1 && (
        <div style={{ marginBottom: '20px' }}>
          {parse(content.description_1)} {/* Render rich text */}
        </div>
      )}
      {content.description_2 && (
        <div style={{ marginBottom: '20px' }}>
          {parse(content.description_2)} {/* Render rich text */}
        </div>
      )}
      {content.description_3 && (
        <div style={{ marginBottom: '20px' }}>
          {parse(content.description_3)} {/* Render rich text */}
        </div>
      )}
    </div>
  );
}

export default BlogSingle;
