import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchBlogs } from '../../services/blogService';
import { Link, useLocation } from 'react-router-dom'; // update import

function BlogList() {
  const { i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const location = useLocation();
  const match = location.pathname.match(/^\/(en|ar)(\/|$)/);
  const lang = match ? match[1] : 'en';
  
  useEffect(() => {
    fetchBlogs(i18n.language)
      .then(data => {
        const sanitizedBlogs = (data?.data || []).map(blog => {
          // If blog.attributes exists, use it; otherwise, use blog directly
          const b = blog.attributes ? blog.attributes : blog;

          let imageUrl = null;
          if (Array.isArray(b.featured_image) && b.featured_image[0]?.url) {
            imageUrl = b.featured_image[0].url.startsWith('http')
              ? b.featured_image[0].url
              : `http://localhost:1337${b.featured_image[0].url}`;
          } else if (b.featured_image?.url) {
            imageUrl = b.featured_image.url.startsWith('http')
              ? b.featured_image.url
              : `http://localhost:1337${b.featured_image.url}`;
          }

          return {
            id: b.documentId || blog.id,
            slug: b.slug,
            title: b.title || 'Untitled',
            descriptionBlocks: Array.isArray(b.description_1) ? b.description_1 : [],
            imageUrl,
            altText: b.alt_text_image || 'No description',
          };
        });

        setBlogs(sanitizedBlogs);
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      });
  }, [i18n.language]); // <-- triggers re-fetch on language change

  const getExcerpt = (blocks) => {
    const text = blocks
      .filter(block => block.type === 'paragraph' && block.children)
      .flatMap(block => block.children.map(child => child.text || ''))
      .join(' ');
    return text.split(' ').slice(0, 8).join(' ') + (text.split(' ').length > 8 ? '...' : '');
  };

  return (
    <>
    <div
      className="blog-list"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        margin: '30px 20px' // 30px top/bottom, 10px left/right
      }}
    >
      {blogs.length > 0 ? (
        blogs.map(blog => (
          <Link
            key={blog.id}
            to={`/${lang}/blog/${blog.slug}`}
            state={{ documentId: blog.id }}
            style={{
              flex: '1 1 calc(33.333% - 20px)',
              boxSizing: 'border-box',
              border: '1px solid #ddd',
              padding: '10px',
              textDecoration: 'none',
              color: 'inherit',
              borderRadius: '5px',
              transition: 'box-shadow 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              cursor: 'pointer'
            }}
          >
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.altText || 'Blog image'}
                style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                onError={e => {
                  console.error('Image failed to load:', blog.imageUrl);
                  e.target.style.display = 'none';
                }}
              />
            )}
            <h2>{blog.title}</h2>
            <p>{getExcerpt(blog.descriptionBlocks)}</p> {/* <-- Bind description here */}
          </Link>
        ))
      ) : (
        <p>No blogs available.</p>
      )}
    </div>

    
    </>
  );
}

export default BlogList;
