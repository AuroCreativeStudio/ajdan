import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchBlogByDocumentId } from '../../services/blogService';
import oneImage from '../../assets/image/one.jpg';

function BlogSingle() {
  const { slug } = useParams();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detect language from URL (assuming format like /en/blog/slug or /ar/blog/slug)
  const lang = location.pathname.startsWith('/ar/') ? 'ar' : 'en';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetchBlogByDocumentId(null, slug, lang);
        const data = res?.data;
        setBlog(data || null);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(lang === 'ar' ? 'فشل تحميل المقال' : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, lang]);

  if (loading) return <div className="py-20 text-center">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;
  if (!blog) return <div className="py-20 text-center">{lang === 'ar' ? 'المقال غير موجود' : 'Blog post not found'}</div>;

  const renderRichText = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return null;
    
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className={`mb-4 ${lang === 'ar' ? 'text-right' : 'text-justify'}`}>
              {block.children?.map((child, i) => (
                <span key={i}>{child.text}</span>
              ))}
            </p>
          );
        case 'heading':
          return (
            <h2 key={index} className={`my-6 text-2xl font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              {block.children?.map((child, i) => (
                <span key={i}>{child.text}</span>
              ))}
            </h2>
          );
        case 'image':
          return (
            <div key={index} className="my-8">
              <img 
                src={block.url} 
                alt={block.alt || (lang === 'ar' ? 'صورة المقال' : 'Blog image')} 
                className="w-full rounded-lg"
                onError={(e) => {
                  e.target.src = oneImage;
                }}
              />
              {block.caption && (
                <p className={`mt-2 text-sm text-gray-500 ${lang === 'ar' ? 'text-right' : 'text-center'}`}>
                  {block.caption}
                </p>
              )}
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className={`w-full ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Full-width header image */}
      <div className="w-full mb-8 overflow-hidden">
        <img 
          src={oneImage} 
          alt={lang === 'ar' ? 'رأس المقال' : 'Blog header'} 
          className="object-cover w-full h-64 md:h-80 lg:h-96"
        />
      </div>

      {/* Content container */}
      <div className="w-full px-4 mx-auto max-w-7xl">
        {/* Blog Title */}
        <h1 className={`mb-6 text-3xl font-bold md:text-4xl ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {blog.title}
        </h1>
        
        {/* Meta Description */}
        {blog.meta_description && (
          <p className={`mb-8 text-lg text-gray-600 ${lang === 'ar' ? 'text-right' : 'text-justify'}`}>
            {blog.meta_description}
          </p>
        )}
        
        {/* Description 1 */}
        {blog.description_1 && (
          <div className={`mb-8 ${lang === 'ar' ? 'text-right' : 'text-justify'}`}>
            {renderRichText(blog.description_1)}
          </div>
        )}
        
        {/* Featured Image */}
        {blog.featured_image?.url && (
          <div className="my-6 aspect-[16/9] overflow-hidden rounded-lg">
            <img 
              className="object-cover w-full h-full"
              src={
                blog.featured_image.url.startsWith('http') 
                  ? blog.featured_image.url 
                  : `http://localhost:1337${blog.featured_image.url}`
              }
              alt={blog.featured_image.alt || blog.title}
              onError={e => {
                console.error('Image failed to load:', blog.featured_image.url);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Description 2 */}
        {blog.description_2 && (
          <div className={`mb-8 ${lang === 'ar' ? 'text-right' : 'text-justify'}`}>
            {renderRichText(blog.description_2)}
          </div>
        )}
        
        {/* Description 3 */}
        {blog.description_3 && (
          <div className={`mb-8 ${lang === 'ar' ? 'text-right' : 'text-justify'}`}>
            {renderRichText(blog.description_3)}
          </div>
        )}
        
        {/* Back button */}
        <div className="mt-12 mb-12">
          <a 
            href={`/${lang}/blogs`} 
            className={`inline-flex items-center text-blue-600 hover:text-blue-800 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
          >
            {lang === 'ar' ? 'العودة إلى جميع المقالات ←' : '← Back to all blogs'}
          </a>
        </div>
      </div>
    </div>
  );
}

export default BlogSingle;