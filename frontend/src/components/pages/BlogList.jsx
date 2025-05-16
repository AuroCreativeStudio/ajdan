import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchBlogs } from '../../services/blogService';
import { Link } from 'react-router-dom'; // Import Link for navigation

function BlogList() {
  const { i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  
  useEffect(() => {
    fetchBlogs(i18n.language)
      .then(data => {
        console.log('Fetched blog data:', data);
        const sanitizedBlogs = (data?.data || []).map(blog => {
          console.log('Full blog object:', blog); // Add this line to inspect structure
          // If featured_image is present and is an array/object with a url
          let imageUrl = null;
          if (Array.isArray(blog.featured_image) && blog.featured_image[0]?.url) {
            imageUrl = blog.featured_image[0].url.startsWith('http')
              ? blog.featured_image[0].url
              : `http://localhost:1337${blog.featured_image[0].url}`;
          } else if (blog.featured_image?.url) {
            imageUrl = blog.featured_image.url.startsWith('http')
              ? blog.featured_image.url
              : `http://localhost:1337${blog.featured_image.url}`;
          }
          console.log('Resolved imageUrl:', imageUrl); // Debug image URL
          return {
            id: blog.documentId,
            slug: blog.slug, // Make sure this field exists in your API
            title: blog.title || 'Untitled',
            descriptionBlocks: Array.isArray(blog.description_1) ? blog.description_1 : [],
            imageUrl,
            altText: blog.alt_text_image || 'No description',
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
            to={`/blog/${blog.slug}`}
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
            {/* <p>{getExcerpt(blog.descriptionBlocks)}</p> */}
            {/* Removed button, card is now clickable */}
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
