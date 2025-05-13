import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchBlogs = async (locale) => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs-and-news`, {
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

export const createBlogPost = async (formData) => {
  return axios.post(`${API_URL}/api/blogs-and-news`, {
    data: formData, // no need to wrap in FormData or set content-type
  });
};


export const updateBlog = async (documentId, blogData) => {
  return axios.put(`${API_URL}/api/blogs-and-news/${documentId}`, {
    data: blogData, // MUST wrap in `data`
  });
};


 ///api/blogs-and-news/:id

export const deleteBlog = async (documentId, blogData) => {
  return axios.delete(`${API_URL}/api/blogs-and-news/${documentId}`, {
    data: blogData, 
  });
};


