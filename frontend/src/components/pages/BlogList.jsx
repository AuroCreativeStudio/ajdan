import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchBlogs } from '../../services/blogService';
import { Link, useLocation } from 'react-router-dom';

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
  }, [i18n.language]);

  const getExcerpt = (blocks) => {
    const text = blocks
      .filter(block => block.type === 'paragraph' && block.children)
      .flatMap(block => block.children.map(child => child.text || ''))
      .join(' ');
    return text;
  };

  return (
    <div
      className="blog-list"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        margin: '30px 20px',
        justifyContent: 'center'
      }}
    >
      {blogs.length > 0 ? (
        blogs.map(blog => (
          <div 
            key={blog.id} 
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Link 
              to={`/${lang}/blog/${blog.slug}`} 
              state={{ documentId: blog.id }}
              className="flex flex-col h-full"
            >
              {blog.imageUrl && (
                <img 
                  className="object-cover w-full h-48 rounded-t-lg" 
                  src={blog.imageUrl} 
                  alt={blog.altText}
                  onError={e => {
                    console.error('Image failed to load:', blog.imageUrl);
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex flex-col flex-grow p-5">
                <h5 
                  className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '3em', // Ensures space for 2 lines
                    lineHeight: '1.5em'
                  }}
                >
                  {blog.title}
                </h5>
                <p 
                  className="flex-grow mb-3 font-normal text-gray-700 dark:text-gray-400"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '4.5em', // Ensures space for 3 lines
                    lineHeight: '1.5em'
                  }}
                >
                  {getExcerpt(blog.descriptionBlocks)}
                </p>
              <div className="inline-flex items-center px-3 py-2 mt-auto text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-fit">
                Read more
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No blogs available.</p>
      )}
    </div>
  );
}

export default BlogList;