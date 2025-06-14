import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchBlogs = async (locale = 'en') => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs-and-news`, {
      params: { 
        'populate': '*',
        'locale': locale
      }
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

// blogService.js
export const createBlogPost = async (data) => {
  try {
    const response = await axios.post(
      'http://localhost:1337/api/blogs-and-news', // Verify this matches your Strapi collection
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};
export const updateBlog = async (id, payload, locale = 'en') => {
  try {
    const response = await axios.put(
      `${API_URL}/api/blogs-and-news/${id}`,  
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: { locale }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};


export const deleteBlog = async (documentId) => {
  return axios.delete(`${API_URL}/api/blogs-and-news/${documentId}`, {
 
  });
};





