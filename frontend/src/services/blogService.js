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

export const fetchBlogBySlug = (slug, locale = 'en') =>
  axios.get(`${API_URL}/api/blogs-and-news`, {
    params: {
      locale,
      filters: { slug: { $eq: slug } },
      populate: '*',
    },
  });

