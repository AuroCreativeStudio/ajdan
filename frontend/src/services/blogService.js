import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchBlogs = async (locale) => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs-and-news?populate=featured_image`, {
      params: { locale },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const fetchBlogByDocumentId = async (documentId = null, slug = null, locale = 'en') => {
  try {
    let url;
    const params = {
      locale,
      populate: '*'
    };

    if (documentId) {
      // Fetch by direct ID
      url = `${API_URL}/api/blogs-and-news/${documentId}`;
    } else if (slug) {
      // Fetch by slug with filters
      url = `${API_URL}/api/blogs-and-news`;
      params['filters[slug][$eq]'] = slug;
    } else {
      throw new Error('Either documentId or slug must be provided');
    }

    const response = await axios.get(url, { params });
    
    // Handle both single item and collection responses
    const data = documentId 
      ? response.data.data 
      : response.data.data?.[0] || null;
    
    console.log('API Response:', data);
    return { data };
    
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

export const fetchBlogBySlug = async (slug, locale = 'en') => {
  try {
    const response = await axios.get(
      `${API_URL}/api/blogs-and-news`,
      {
        params: {
          'filters[slug][$eq]': slug,
          locale,
          populate: '*',
        },
      }
    );
    // Strapi returns an array in data
    return response.data.data && response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    throw error;
  }
};

export const createBlogPost = async (formData) => {
  return axios.post(`${API_URL}/api/blogs-and-news`, {
    data: formData, 
  });
};

export const updateBlog = async (documentId, data, locale) => {

  let url = `${API_URL.replace(/\/$/, '')}/api/blogs-and-news/${documentId}`;
  if (locale) {
    url += `?locale=${locale}`;
  }
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error('Update blog error:', error.response?.data || error.message);
    throw error;
  }
};


export const deleteBlog = async (documentId) => {
  return axios.delete(`${API_URL}/api/blogs-and-news/${documentId}`, {
 
  });
};





