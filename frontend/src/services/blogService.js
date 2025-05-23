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

export const fetchBlogByDocumentId = async (documentId, slug = null, locale = 'en') => {
  try {
    const url = documentId
      ? `${API_URL}/api/blogs-and-news/${documentId}`
      : `${API_URL}/api/blogs-and-news?filters[slug][$eq]=${slug}`;
    const response = await axios.get(url, {
      params: {
        locale,
        populate: '*',
      },
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog by documentId:', error);
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
    return response.data.data && response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    throw error;
  }
};

export const createBlogPost = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/blogs-and-news`, {
      data: formData,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (documentId, data) => {
  try {
    const response = await axios.put(`${API_URL}/api/blogs-and-news/${documentId}`, data);
    return response.data;
  } catch (error) {
    console.error('Update blog error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteBlog = async (documentId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/blogs-and-news/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};